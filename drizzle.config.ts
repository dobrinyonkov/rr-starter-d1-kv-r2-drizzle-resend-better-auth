import { existsSync, readdirSync } from "node:fs";
import type { Config } from "drizzle-kit";

const D1_DIR = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject";

function getLocalD1Path(): string {
  if (!existsSync(D1_DIR)) return "";
  const file = readdirSync(D1_DIR).find((f) => f.endsWith(".sqlite"));
  return file ? `${D1_DIR}/${file}` : "";
}

export default {
  schema: "./drizzle/schema/index.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: { url: getLocalD1Path() },
} satisfies Config;
