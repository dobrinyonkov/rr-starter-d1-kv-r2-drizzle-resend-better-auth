# React Router + Cloudflare Starter

Everything you need to build a full-stack app on Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dobrinyonkov/rr-starter-d1-kv-r2-drizzle-resend-better-auth)

## Stack

- **Framework** — [React Router v7](https://reactrouter.com/) (SSR)
- **Runtime** — [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- **Auth** — [Better Auth](https://www.better-auth.com/) (magic link + GitHub OAuth)
- **Database** — [Cloudflare D1](https://developers.cloudflare.com/d1/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Sessions** — [Cloudflare KV](https://developers.cloudflare.com/kv/) (secondary storage + rate limiting)
- **Email** — [Resend](https://resend.com/) + [React Email](https://react.email/)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Tooling** — TypeScript, [Biome](https://biomejs.dev/), [Vitest](https://vitest.dev/)

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/dobrinyonkov/starter.git my-app
cd my-app
pnpm install
```

### 2. Create Cloudflare resources

```bash
# Production resources
npx wrangler d1 create my-app
npx wrangler kv namespace create KV
npx wrangler r2 bucket create my-app

# Staging resources (for PR preview deployments)
npx wrangler d1 create my-app-staging
npx wrangler kv namespace create KV_STAGING
```

Copy the returned IDs into `wrangler.jsonc` — production IDs go in the top-level bindings, staging IDs go in `env.staging`.

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | How to get it |
|----------|--------------|
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `GITHUB_CLIENT_ID` | [GitHub Developer Settings](https://github.com/settings/developers) |
| `GITHUB_CLIENT_SECRET` | Same as above |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) |
| `RESEND_FROM` | Verified domain in Resend (use `onboarding@resend.dev` for testing) |

### 4. Run migrations & start dev

```bash
pnpm db:migrate:local
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy

### One-click deploy

Click the button above to deploy via the Cloudflare dashboard. The deploy flow will:
1. Fork the repo into your GitHub account
2. Auto-provision D1, KV, and R2 resources for **production**
3. Build and deploy the Worker

After the initial deploy, [set up staging for PR previews](#staging-environment-for-pr-previews).

### Manual deploy

```bash
pnpm deploy
```

This builds the app, applies D1 migrations, and deploys to Cloudflare Workers.

### Staging environment (for PR previews)

The `wrangler.jsonc` includes an `env.staging` block with separate D1 and KV bindings. PR preview deployments use this environment so they never touch your production database.

**Initial setup** (once per project):

1. Create staging resources and paste IDs into `wrangler.jsonc` under `env.staging` (see [step 2](#2-create-cloudflare-resources))
2. In the Cloudflare dashboard under **Workers & Pages > your project > Settings > Build**, set the **Non-production branch deploy command** to:
   ```
   CLOUDFLARE_ENV=staging pnpm run build && npx wrangler d1 migrations apply DB --remote --env staging && npx wrangler versions upload --env staging
   ```
3. Apply initial migrations to the staging DB:
   ```bash
   pnpm db:migrate:staging
   ```

Now every PR push builds against the staging environment, runs migrations on the staging D1, and deploys an isolated preview.

**Manual staging deploy:**

```bash
pnpm deploy:staging
```

## Project Structure

```
workers/app.ts              Cloudflare Worker entry point
app/
  lib/
    auth.server.ts          Better Auth config (D1, KV, magic link, GitHub)
    auth.client.ts          Better Auth client
    db.server.ts            Drizzle D1 client
    email.server.ts         Resend email sender
  middleware/
    context.ts              Typed route contexts (client-safe)
    auth.server.ts          Auth guard middleware (server-only)
  emails/
    magic-link.tsx          React Email template
  routes/
    _index.tsx              Landing page
    api/auth.$.tsx          Better Auth API handler
    auth/sign-in.tsx        Magic link + GitHub sign-in
    app/layout.tsx          Authenticated shell with sidebar
    app/dashboard.tsx       Dashboard
    app/notes.tsx           Notes CRUD demo
    app/settings.tsx        User profile + sessions
  routes.ts                 Manual route configuration
drizzle/
  schema/                   Drizzle table definitions
  migrations/               Generated SQL migrations
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with local D1 + KV |
| `pnpm build` | Production build |
| `pnpm deploy` | Build + migrate + deploy to Cloudflare |
| `pnpm deploy:staging` | Build + migrate + deploy to staging env |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm db:generate` | Generate migration from schema changes |
| `pnpm db:migrate:local` | Apply migrations locally |
| `pnpm db:migrate:remote` | Apply migrations to production D1 |
| `pnpm db:migrate:staging` | Apply migrations to staging D1 |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm check` | Lint + format check (Biome) |

## License

MIT
