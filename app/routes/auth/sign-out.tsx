import { redirect } from "react-router";
import { auth } from "~/lib/auth.server";

// Sign out is a POST action — call it with a form or fetcher
export async function action({ request }: { request: Request }) {
	await auth.api.signOut({ headers: request.headers });
	return redirect("/sign-in");
}

// If someone GETs /sign-out, redirect to home
export function loader() {
	return redirect("/");
}
