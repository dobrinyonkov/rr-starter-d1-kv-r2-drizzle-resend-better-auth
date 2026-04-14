import { redirect } from "react-router";
import { auth } from "~/lib/auth.server";
import { type Session, sessionContext, userContext } from "./context";

// Re-export contexts for convenience
export { sessionContext, userContext } from "./context";
export type { SessionUser, Session } from "./context";

// Get session from request (uses Better Auth's getSession)
async function getSession(request: Request): Promise<Session | null> {
	const result = await auth.api.getSession({ headers: request.headers });
	if (!result) return null;
	return {
		user: {
			id: result.user.id,
			name: result.user.name,
			email: result.user.email,
			image: result.user.image,
		},
		session: {
			id: result.session.id,
			expiresAt: result.session.expiresAt,
		},
	};
}

// Guest-only routes: redirect authenticated users to /app
const GUEST_ROUTES = ["/sign-in"];

// Protected routes: redirect unauthenticated users to /sign-in
const PROTECTED_PREFIXES = ["/app"];

export const authMiddleware = async ({
	request,
	context,
}: {
	request: Request;
	context: { set: Function };
}) => {
	const url = new URL(request.url);
	const session = await getSession(request);

	// Guest-only routes
	if (GUEST_ROUTES.some((r) => url.pathname === r)) {
		if (session) throw redirect("/app");
		context.set(sessionContext, null);
		return;
	}

	// Protected routes
	if (PROTECTED_PREFIXES.some((p) => url.pathname.startsWith(p))) {
		if (!session)
			throw redirect(`/sign-in?redirectTo=${encodeURIComponent(url.pathname)}`);
		context.set(sessionContext, session);
		context.set(userContext, session.user);
		return;
	}

	// Public routes — set session if available
	context.set(sessionContext, session);
};
