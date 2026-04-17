import { env } from "cloudflare:workers";
import { render } from "@react-email/components";
import { MagicLinkEmail } from "../emails/magic-link";

export async function sendMagicLinkEmail({
	to,
	url,
}: { to: string; url: string }) {
	const html = await render(MagicLinkEmail({ url }));

	await env.SEND_EMAIL.send({
		from: env.FROM_EMAIL,
		to,
		subject: "Sign in to Starter",
		html,
	});
}
