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
# Create D1 database
npx wrangler d1 create starter
# Create KV namespace
npx wrangler kv namespace create KV
```

Copy the returned IDs into `wrangler.jsonc`.

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

```bash
pnpm deploy
```

This builds the app, applies D1 migrations, and deploys to Cloudflare Workers.

## Preview Deployments

Preview deployments use a separate D1 database so they don't touch production data. A GitHub Actions workflow (`.github/workflows/preview.yml`) wipes and re-migrates the preview DB on every PR push.

### Setup

1. Create a preview D1 database:
   ```bash
   npx wrangler d1 create <your-app>-preview
   ```
2. Paste the returned `database_id` as `preview_database_id` in `wrangler.jsonc`
3. Add these GitHub repository secrets (Settings > Secrets and variables > Actions):

   | Secret | How to get it |
   |--------|--------------|
   | `CLOUDFLARE_API_TOKEN` | [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) — create a token with **D1 Edit** and **Workers Scripts Edit** permissions |
   | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard sidebar > Account ID |

4. Update the `PREVIEW_D1_DATABASE_NAME` env var in `.github/workflows/preview.yml` to match your database name

The workflow runs automatically on PR open/push, and can be triggered manually via **Actions > Preview DB Setup > Run workflow** to switch between PRs.

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
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm db:generate` | Generate migration from schema changes |
| `pnpm db:migrate:local` | Apply migrations locally |
| `pnpm db:migrate:remote` | Apply migrations to production D1 |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm check` | Lint + format check (Biome) |

## License

MIT
