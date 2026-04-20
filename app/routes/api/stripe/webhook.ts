import { eq } from "drizzle-orm";
import { users } from "~/db/schema";
import { db } from "~/lib/db.server";
import { getStripe } from "~/lib/stripe.server";

export async function action({ request }: { request: Request }) {
	const { env } = await import("cloudflare:workers");
	const stripe = getStripe(env);

	const rawBody = await request.text();
	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		return Response.json(
			{ error: "Missing stripe-signature header" },
			{ status: 400 },
		);
	}

	let event: ReturnType<typeof stripe.webhooks.constructEvent> extends Promise<
		infer T
	>
		? T
		: never;

	try {
		event = await stripe.webhooks.constructEventAsync(
			rawBody,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("Webhook signature verification failed:", message);
		return Response.json({ error: "Invalid signature" }, { status: 400 });
	}

	const subscription = event.data.object as {
		id: string;
		status: string;
		customer: string;
		metadata?: { userId?: string };
	};

	const userId = subscription.metadata?.userId;
	if (!userId) {
		console.error("No userId in subscription metadata");
		return Response.json({ received: true });
	}

	switch (event.type) {
		case "customer.subscription.created":
			await db
				.update(users)
				.set({
					isPro: true,
					stripeCustomerId: subscription.customer,
					stripeSubscriptionId: subscription.id,
				})
				.where(eq(users.id, userId));
			break;

		case "customer.subscription.deleted":
			await db.update(users).set({ isPro: false }).where(eq(users.id, userId));
			break;

		case "customer.subscription.updated":
			await db
				.update(users)
				.set({ isPro: subscription.status === "active" })
				.where(eq(users.id, userId));
			break;

		default:
			break;
	}

	return Response.json({ received: true });
}
