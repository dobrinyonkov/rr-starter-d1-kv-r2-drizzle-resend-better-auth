import type { ReactNode } from "react";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from "react-router";

import { DevToolsPanel } from "~/components/DevToolsPanel";
import { DevToolsProvider } from "~/components/DevToolsProvider";
import "./styles/app.css";

export function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-full antialiased">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function Root() {
	return (
		<DevToolsProvider>
			<Outlet />
			<DevToolsPanel />
		</DevToolsProvider>
	);
}

export function ErrorBoundary({ error }: { error: unknown }) {
	let heading = "Something went wrong";
	let message = "An unexpected error occurred.";

	if (isRouteErrorResponse(error)) {
		heading = `${error.status} ${error.statusText}`;
		message = error.data?.toString() || message;
	} else if (error instanceof Error) {
		message = error.message;
	}

	return (
		<div className="flex min-h-full items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold">{heading}</h1>
				<p className="mt-2 text-muted-foreground">{message}</p>
			</div>
		</div>
	);
}
