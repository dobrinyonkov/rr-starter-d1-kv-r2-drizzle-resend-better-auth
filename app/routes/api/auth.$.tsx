import { auth } from "~/lib/auth.server";
import { getErrorMessage } from "~/lib/utils";

// Better Auth catch-all API handler
export async function loader({ request }: { request: Request }) {
	try {
		return await auth.handler(request);
	} catch (error) {
		console.error("Auth API error:", error);
		return new Response(
			JSON.stringify({ success: false, error: getErrorMessage(error) }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}

export async function action({ request }: { request: Request }) {
	try {
		return await auth.handler(request);
	} catch (error) {
		console.error("Auth API error:", error);
		return new Response(
			JSON.stringify({ success: false, error: getErrorMessage(error) }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}
