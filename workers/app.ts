import {
	RouterContextProvider,
	createContext,
	createRequestHandler,
} from "react-router";

// Typed context for accessing Cloudflare bindings in loaders/actions
export const cloudflareContext = createContext<{
	env: Env;
	ctx: ExecutionContext;
}>();

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	fetch(request, env, ctx) {
		const contextProvider = new RouterContextProvider(
			new Map([[cloudflareContext, { env, ctx }]]),
		);
		return requestHandler(request, contextProvider);
	},
} satisfies ExportedHandler<Env>;
