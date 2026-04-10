import { auth } from "~/lib/auth.server";

// Better Auth catch-all API handler
export async function loader({ request }: { request: Request }) {
  return auth.handler(request);
}

export async function action({ request }: { request: Request }) {
  return auth.handler(request);
}
