import { authMiddleware } from "~/middleware/auth.server";
import { getStripe } from "~/lib/stripe.server";
import { userContext } from "~/middleware/context";

export async function action({
	request,
	context,
}: { request: Request; context: { get: Function } }) {
	const user = context.get(userContext);
	if (!user) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { env } = await import("cloudflare:workers");
	const stripe = getStripe(env);

	const session = await stripe.checkout.sessions.create({
		mode: "subscription",
		line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
		success_url: `${env.APP_URL}/app/settings?success=true`,
		cancel_url: `${env.APP_URL}/app/settings?cancelled=true`,
		customer_email: user.email,
		metadata: { userId: user.id },
		subscription_data: { metadata: { userId: user.id } },
	});

	return Response.json({ url: session.url });
}

export const middleware = [authMiddleware];
