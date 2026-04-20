import Stripe from "stripe";

export const getStripe = (env: Env) =>
	new Stripe(env.STRIPE_SECRET_KEY, {
		apiVersion: "2025-01-27.acacia",
	});
