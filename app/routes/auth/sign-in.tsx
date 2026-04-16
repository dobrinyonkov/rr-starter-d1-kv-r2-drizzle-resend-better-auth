import { ArrowRight, Github, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { signIn } from "~/lib/auth.client";

function getErrorMessage(error: unknown): string {
	if (!error) return "An unknown error occurred";
	if (typeof error === "object" && error !== null) {
		if ("message" in error && typeof error.message === "string") {
			return error.message;
		}
		if ("error" in error && typeof error.error === "string") {
			return error.error;
		}
	}
	if (typeof error === "string") {
		return error;
	}
	return "An unexpected error occurred. Please try again.";
}

export default function SignIn() {
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") || "/app";

	const [email, setEmail] = useState("");
	const [magicLinkSent, setMagicLinkSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleMagicLink(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const { error } = await signIn.magicLink({
				email,
				callbackURL: redirectTo,
			});
			if (error) {
				setError(error.message || "Failed to send magic link");
			} else {
				setMagicLinkSent(true);
			}
		} catch (err) {
			setError(getErrorMessage(err));
		} finally {
			setLoading(false);
		}
	}

	async function handleGitHub() {
		setError("");
		try {
			const result = await signIn.social({
				provider: "github",
				callbackURL: redirectTo,
			});
			if (result?.error) {
				setError(getErrorMessage(result.error));
			}
		} catch (err) {
			setError(getErrorMessage(err));
		}
	}

	if (magicLinkSent) {
		return (
			<div className="space-y-4 text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Mail className="h-6 w-6 text-primary" />
				</div>
				<h1 className="text-2xl font-bold">Check your email</h1>
				<p className="text-sm text-muted-foreground">
					We sent a sign-in link to <strong>{email}</strong>
				</p>
				<button
					type="button"
					onClick={() => setMagicLinkSent(false)}
					className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
				>
					Use a different email
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-bold">Sign in</h1>
				<p className="text-sm text-muted-foreground">
					Choose your preferred sign-in method
				</p>
			</div>

			{/* GitHub */}
			<button
				type="button"
				onClick={handleGitHub}
				className="flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
			>
				<Github className="h-4 w-4" />
				Continue with GitHub
			</button>

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">or</span>
				</div>
			</div>

			{/* Magic Link */}
			<form onSubmit={handleMagicLink} className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-medium">
						Email
					</label>
					<input
						id="email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					/>
				</div>

				{error && (
					<div className="rounded bg-error-container p-3 border border-error">
						<p className="text-xs font-medium text-error">{error}</p>
					</div>
				)}

				<button
					type="submit"
					disabled={loading}
					className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
				>
					{loading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							Send magic link <ArrowRight className="h-4 w-4" />
						</>
					)}
				</button>
			</form>
		</div>
	);
}
