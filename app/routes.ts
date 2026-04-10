import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	// Public
	index("routes/_index.tsx"),

	// Better Auth API handler
	route("api/auth/*", "routes/api/auth.$.tsx"),

	// Photo upload / serve API (authenticated via middleware)
	route("api/photos/*", "routes/api/photos.$.tsx"),

	// Auth pages (guest only)
	layout("routes/auth/layout.tsx", [
		route("sign-in", "routes/auth/sign-in.tsx"),
	]),
	route("sign-out", "routes/auth/sign-out.tsx"),

	// Authenticated app
	layout("routes/app/layout.tsx", [
		...prefix("app", [
			index("routes/app/dashboard.tsx"),
			route("notes", "routes/app/notes.tsx"),
			route("settings", "routes/app/settings.tsx"),
		]),
	]),

	// 404
	route("*", "routes/$.tsx"),
] satisfies RouteConfig;
