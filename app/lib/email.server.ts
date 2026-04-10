import { env } from "cloudflare:workers";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { MagicLinkEmail } from "../emails/magic-link";

export async function sendMagicLinkEmail({ to, url }: { to: string; url: string }) {
  const resend = new Resend(env.RESEND_API_KEY);
  const html = await render(MagicLinkEmail({ url }));

  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: "Sign in to Starter",
    html,
  });
}
