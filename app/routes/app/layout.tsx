import { LayoutDashboard, LogOut, Settings, StickyNote } from "lucide-react";
import { Form, Link, NavLink, Outlet } from "react-router";
import { authMiddleware } from "~/middleware/auth.server";

export const middleware = [authMiddleware];

// Need a loader so middleware runs on client navigations
export function loader() {
	return null;
}

export default function AppLayout() {
	return (
		<div className="flex min-h-full">
			{/* Sidebar */}
			<aside className="hidden w-56 shrink-0 border-r bg-card md:block">
				<div className="flex h-full flex-col">
					<div className="border-b px-4 py-3">
						<Link to="/app" className="text-lg font-bold">
							Starter
						</Link>
					</div>

					<nav className="flex-1 space-y-1 p-2">
						<SidebarLink to="/app" icon={LayoutDashboard} end>
							Dashboard
						</SidebarLink>
						<SidebarLink to="/app/notes" icon={StickyNote}>
							Notes
						</SidebarLink>
						<SidebarLink to="/app/settings" icon={Settings}>
							Settings
						</SidebarLink>
					</nav>

					<div className="border-t p-2">
						<Form action="/sign-out" method="post">
							<button
								type="submit"
								className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
							>
								<LogOut className="h-4 w-4" />
								Sign out
							</button>
						</Form>
					</div>
				</div>
			</aside>

			{/* Main content */}
			<main className="flex-1">
				{/* Mobile header */}
				<header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
					<Link to="/app" className="text-lg font-bold">
						Starter
					</Link>
					<Form action="/sign-out" method="post">
						<button
							type="submit"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Sign out
						</button>
					</Form>
				</header>

				<div className="p-6 pb-24 md:pb-6">
					<Outlet />
				</div>
			</main>

			{/* Mobile bottom navigation */}
			<nav className="fixed bottom-0 left-0 right-0 z-10 flex border-t bg-card md:hidden">
				<MobileNavLink to="/app" icon={LayoutDashboard} end>
					Dashboard
				</MobileNavLink>
				<MobileNavLink to="/app/notes" icon={StickyNote}>
					Notes
				</MobileNavLink>
				<MobileNavLink to="/app/settings" icon={Settings}>
					Settings
				</MobileNavLink>
			</nav>
		</div>
	);
}

function SidebarLink({
	to,
	icon: Icon,
	children,
	end,
}: {
	to: string;
	icon: React.ElementType;
	children: React.ReactNode;
	end?: boolean;
}) {
	return (
		<NavLink
			to={to}
			end={end}
			className={({ isActive }) =>
				`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
					isActive
						? "bg-accent text-foreground font-medium"
						: "text-muted-foreground hover:bg-accent hover:text-foreground"
				}`
			}
		>
			<Icon className="h-4 w-4" />
			{children}
		</NavLink>
	);
}

function MobileNavLink({
	to,
	icon: Icon,
	children,
	end,
}: {
	to: string;
	icon: React.ElementType;
	children: React.ReactNode;
	end?: boolean;
}) {
	return (
		<NavLink
			to={to}
			end={end}
			className={({ isActive }) =>
				`flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
					isActive
						? "font-medium text-foreground"
						: "text-muted-foreground hover:text-foreground"
				}`
			}
		>
			<Icon className="h-5 w-5" />
			{children}
		</NavLink>
	);
}
