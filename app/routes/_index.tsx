import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // Production deployment
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 text-center">
      <div className="max-w-lg space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          React Router + Cloudflare Starter
        </h1>
        <p className="text-lg text-muted-foreground">
          Better Auth, D1 + Drizzle, KV, Resend, Tailwind, and shadcn/ui. Everything you need to
          build on Cloudflare Workers.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-input px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
