import {
	AlertCircle,
	Bug,
	ChevronDown,
	ChevronUp,
	Globe,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";
import { useDevTools } from "./DevToolsProvider";

const typeIcons = {
	fetch: Globe,
	action: AlertCircle,
	loader: AlertCircle,
	error: AlertCircle,
	warn: AlertCircle,
	log: Bug,
};

const typeColors = {
	fetch: "text-blue-400 bg-blue-500/10 border-blue-500/30",
	action: "text-red-400 bg-red-500/10 border-red-500/30",
	loader: "text-orange-400 bg-orange-500/10 border-orange-500/30",
	error: "text-red-400 bg-red-500/10 border-red-500/30",
	warn: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
	log: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30",
};

export function DevToolsPanel() {
	const { errors, clearErrors, isEnabled } = useDevTools();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedError, setSelectedError] = useState<string | null>(null);

	if (!isEnabled) return null;

	return (
		<>
			{/* Toggle Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-4 py-2 shadow-lg"
			>
				<Bug className="h-4 w-4 text-emerald-400" />
				<span className="text-xs font-medium text-zinc-300">DevTools</span>
				{errors.length > 0 && (
					<span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
						{errors.length > 99 ? "99+" : errors.length}
					</span>
				)}
			</button>

			{/* Panel */}
			{isOpen && (
				<div className="fixed bottom-16 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-md max-h-[70vh] flex flex-col rounded-lg bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
						<div className="flex items-center gap-2">
							<Bug className="h-4 w-4 text-emerald-400" />
							<span className="text-sm font-semibold text-zinc-100">
								DevTools
							</span>
							<span className="text-xs text-zinc-500">({errors.length})</span>
						</div>
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={clearErrors}
								className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"
							>
								<Trash2 className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Error List */}
					<div className="flex-1 overflow-y-auto">
						{errors.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12">
								<Bug className="h-10 w-10 text-zinc-700 mb-3" />
								<p className="text-sm text-zinc-500">No errors captured yet</p>
							</div>
						) : (
							<div className="divide-y divide-zinc-800">
								{errors.map((error) => {
									const Icon = typeIcons[error.type];
									const colorClass = typeColors[error.type];
									const isExpanded = selectedError === error.id;
									return (
										<div key={error.id}>
											<button
												type="button"
												onClick={() =>
													setSelectedError(isExpanded ? null : error.id)
												}
												className="w-full px-4 py-3 flex items-start gap-3 hover:bg-zinc-900/50 text-left"
											>
												<div
													className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center border ${colorClass}`}
												>
													<Icon className="h-3.5 w-3.5" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2">
														<span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
															{error.type}
														</span>
														<span className="text-[10px] text-zinc-600">
															{error.timestamp.toLocaleTimeString()}
														</span>
													</div>
													<p className="text-sm text-zinc-300 mt-1 truncate">
														{error.message}
													</p>
													{error.url && (
														<p className="text-xs text-zinc-600 truncate">
															{error.url}
														</p>
													)}
												</div>
												{isExpanded ? (
													<ChevronUp className="h-4 w-4 text-zinc-600" />
												) : (
													<ChevronDown className="h-4 w-4 text-zinc-600" />
												)}
											</button>
											{isExpanded && (
												<div className="px-4 pb-3 bg-zinc-900/30">
													<div className="pl-10">
														{error.status && (
															<p className="text-xs text-zinc-500">
																Status: {error.status}
															</p>
														)}
														{error.url && (
															<p className="text-xs font-mono text-zinc-400 break-all">
																{error.url}
															</p>
														)}
														{error.details && (
															<pre className="mt-1 p-2 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 overflow-x-auto max-h-40">
																{typeof error.details === "string"
																	? error.details
																	: JSON.stringify(error.details, null, 2)}
															</pre>
														)}
													</div>
												</div>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
