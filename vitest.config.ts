import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // Mock cloudflare:workers for test environment (jsdom)
      "cloudflare:workers": new URL("./test/mocks/cloudflare-workers.ts", import.meta.url).pathname,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["app/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}"],
  },
});
