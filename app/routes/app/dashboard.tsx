import { userContext } from "~/middleware/context";

export function loader({ context }: { context: { get: Function } }) {
  const user = context.get(userContext);
  return { user };
}

export default function Dashboard({ loaderData }: { loaderData: { user: { name: string; email: string } } }) {
  const { user } = loaderData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name || user.email}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Auth" description="Magic link + GitHub OAuth powered by Better Auth with session caching in Cloudflare KV." />
        <Card title="Database" description="Cloudflare D1 with Drizzle ORM. SQLite in production, local file in development." />
        <Card title="Email" description="Transactional email with Resend and React Email templates." />
      </div>
    </div>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-1.5">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
