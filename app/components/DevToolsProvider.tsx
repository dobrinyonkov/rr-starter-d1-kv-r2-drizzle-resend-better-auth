import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface ErrorEntry {
	id: string;
	timestamp: Date;
	type: "fetch" | "action" | "loader" | "error" | "warn" | "log";
	message: string;
	details?: unknown;
	url?: string;
	status?: number;
}

interface DevToolsContextType {
	errors: ErrorEntry[];
	addError: (entry: Omit<ErrorEntry, "id" | "timestamp">) => void;
	clearErrors: () => void;
	isEnabled: boolean;
}

const DevToolsContext = createContext<DevToolsContextType | null>(null);

function isDevToolsEnabled(): boolean {
	if (typeof window === "undefined") return false;
	if (
		window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1"
	)
		return true;
	if (window.location.hostname.includes("staging")) return true;
	if (window.location.search.includes("devtools=1")) return true;
	if (
		typeof localStorage !== "undefined" &&
		localStorage.getItem("devToolsEnabled") === "true"
	)
		return true;
	return false;
}

export function DevToolsProvider({ children }: { children: React.ReactNode }) {
	const [errors, setErrors] = useState<ErrorEntry[]>([]);
	const [isEnabled] = useState(() => isDevToolsEnabled());

	const addError = useCallback(
		(entry: Omit<ErrorEntry, "id" | "timestamp">) => {
			if (!isEnabled) return;
			const newError: ErrorEntry = {
				...entry,
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				timestamp: new Date(),
			};
			setErrors((prev) => [newError, ...prev].slice(0, 50));
		},
		[isEnabled],
	);

	const clearErrors = useCallback(() => setErrors([]), []);

	// Intercept console errors
	useEffect(() => {
		if (!isEnabled) return;
		const originalError = console.error;
		const originalWarn = console.warn;
		console.error = (...args: unknown[]) => {
			addError({
				type: "error",
				message: args
					.map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
					.join(" "),
				details: args,
			});
			originalError.apply(console, args);
		};
		console.warn = (...args: unknown[]) => {
			addError({
				type: "warn",
				message: args
					.map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
					.join(" "),
				details: args,
			});
			originalWarn.apply(console, args);
		};
		return () => {
			console.error = originalError;
			console.warn = originalWarn;
		};
	}, [isEnabled, addError]);

	// Intercept fetch errors
	useEffect(() => {
		if (!isEnabled) return;
		const originalFetch = window.fetch;
		window.fetch = async (...args) => {
			const url =
				typeof args[0] === "string" ? args[0] : args[0]?.toString() || "";
			try {
				const response = await originalFetch.apply(window, args);
				if (!response.ok) {
					const clonedResponse = response.clone();
					const text = await clonedResponse.text().catch(() => null);
					addError({
						type: "fetch",
						message: `HTTP ${response.status}: ${response.statusText}`,
						url,
						status: response.status,
						details: text,
					});
				}
				return response;
			} catch (error) {
				addError({
					type: "fetch",
					message: error instanceof Error ? error.message : "Network error",
					url,
					details: error,
				});
				throw error;
			}
		};
		return () => {
			window.fetch = originalFetch;
		};
	}, [isEnabled, addError]);

	return (
		<DevToolsContext.Provider
			value={{ errors, addError, clearErrors, isEnabled }}
		>
			{children}
		</DevToolsContext.Provider>
	);
}

export function useDevTools() {
	const context = useContext(DevToolsContext);
	if (!context)
		throw new Error("useDevTools must be used within DevToolsProvider");
	return context;
}
