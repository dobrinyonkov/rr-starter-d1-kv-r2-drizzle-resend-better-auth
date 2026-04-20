import { eq } from "drizzle-orm";
import { authMiddleware } from "~/middleware/auth.server";
import { users } from "~/db/schema";
import { db } from "~/lib/db.server";
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

	// Fetch user from DB to get stripeCustomerId
	const [dbUser] = await db
		.select({ stripeCustomerId: users.stripeCustomerId })
		.from(users)
		.where(eq(users.id, user.id));

	if (!dbUser?.stripeCustomerId) {
		return Response.json(
			{ error: "No billing account found" },
			{ status: 400 },
		);
	}

	try {
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: dbUser.stripeCustomerId,
			return_url: `${env.APP_URL}/app/settings`,
		});

		return Response.json({ url: portalSession.url });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to open billing portal";
		return Response.json({ error: message }, { status: 500 });
	}
}

export const middleware = [authMiddleware];
