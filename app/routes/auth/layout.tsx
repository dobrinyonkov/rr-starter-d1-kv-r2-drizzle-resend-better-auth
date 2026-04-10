import { Outlet } from "react-router";
import { authMiddleware } from "~/middleware/auth.server";

export const middleware = [authMiddleware];

// Centered card layout for auth pages
export default function AuthLayout() {
	return (
		<div className="flex min-h-full items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<Outlet />
			</div>
		</div>
	);
}
