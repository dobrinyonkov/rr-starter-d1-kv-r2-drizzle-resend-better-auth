import { eq } from "drizzle-orm";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { useRef, useState } from "react";
import { useRevalidator } from "react-router";
import { users } from "~/db/schema";
import { auth } from "~/lib/auth.server";
import { db } from "~/lib/db.server";
import { userContext } from "~/middleware/context";

export async function loader({
	request,
	context,
}: { request: Request; context: { get: Function } }) {
	const sessionUser = context.get(userContext);
	const [dbUsers, sessions] = await Promise.all([
		db.select().from(users).where(eq(users.id, sessionUser.id)),
		auth.api.listSessions({ headers: request.headers }),
	]);
	const user = dbUsers[0]
		? {
				id: dbUsers[0].id,
				name: dbUsers[0].name,
				email: dbUsers[0].email,
				image: dbUsers[0].image,
			}
		: sessionUser;
	return { user, sessions };
}

type Session = {
	id: string;
	token: string;
	userAgent: string | null;
	ipAddress: string | null;
	expiresAt: string;
	createdAt: string;
};

function getPhotoUrl(image: string | null): string | null {
	if (!image) return null;
	if (image.startsWith("http")) return image;
	return `/api/photos/${image}`;
}

export default function SettingsPage({
	loaderData,
}: {
	loaderData: {
		user: { id: string; name: string; email: string; image: string | null };
		sessions: Session[];
	};
}) {
	const { user, sessions } = loaderData;

	return (
		<div className="space-y-8 max-w-2xl">
			<div>
				<h1 className="text-2xl font-bold">Settings</h1>
				<p className="text-muted-foreground">Manage your account.</p>
			</div>

			{/* Profile photo */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Profile photo</h2>
				<PhotoUpload image={user.image} name={user.name} />
			</section>

			{/* Profile */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Profile</h2>
				<div className="rounded-lg border bg-card p-4 space-y-3">
					<Row label="Name" value={user.name || "—"} />
					<Row label="Email" value={user.email} />
					<Row label="User ID" value={user.id} />
				</div>
			</section>

			{/* Active Sessions */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Active sessions</h2>
				<div className="rounded-lg border bg-card divide-y">
					{sessions.map((s) => (
						<div key={s.id} className="p-4 space-y-1">
							<p className="text-sm font-medium truncate">
								{s.userAgent || "Unknown device"}
							</p>
							<p className="text-xs text-muted-foreground">
								{s.ipAddress || "Unknown IP"} &middot; Expires{" "}
								{new Date(s.expiresAt).toLocaleDateString()}
							</p>
						</div>
					))}
					{sessions.length === 0 && (
						<p className="p-4 text-sm text-muted-foreground">
							No active sessions.
						</p>
					)}
				</div>
			</section>
		</div>
	);
}

function PhotoUpload({ image, name }: { image: string | null; name: string }) {
	const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const revalidator = useRevalidator();

	const photoUrl = getPhotoUrl(image);

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setError(null);
		setUploading(true);

		try {
			const formData = new FormData();
			formData.append("photo", file);

			const response = await fetch("/api/photos", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Upload failed");
				return;
			}

			revalidator.revalidate();
		} catch {
			setError("Upload failed. Please try again.");
		} finally {
			setUploading(false);
			// Reset file input so the same file can be re-selected
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	}

	async function handleDelete() {
		setError(null);
		setDeleting(true);

		try {
			const response = await fetch("/api/photos", {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				setError(data.error || "Delete failed");
				return;
			}

			revalidator.revalidate();
		} catch {
			setError("Delete failed. Please try again.");
		} finally {
			setDeleting(false);
		}
	}

	const initials = name
		? name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: null;

	return (
		<div className="rounded-lg border bg-card p-4">
			<div className="flex items-center gap-4">
				{/* Avatar */}
				<div className="relative h-16 w-16 shrink-0">
					{photoUrl ? (
						<img
							src={photoUrl}
							alt="Profile avatar"
							className="h-16 w-16 rounded-full object-cover"
						/>
					) : (
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
							{initials ? (
								<span className="text-lg font-medium text-muted-foreground">
									{initials}
								</span>
							) : (
								<User className="h-6 w-6 text-muted-foreground" />
							)}
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-2">
					<div className="flex gap-2">
						<label
							htmlFor="photo-upload"
							className={`inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors ${
								uploading ? "pointer-events-none opacity-50" : ""
							}`}
						>
							{uploading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Camera className="h-4 w-4" />
							)}
							{uploading ? "Uploading…" : "Upload photo"}
						</label>
						<input
							ref={fileInputRef}
							id="photo-upload"
							type="file"
							accept="image/jpeg,image/png,image/gif,image/webp"
							className="hidden"
							onChange={handleFileChange}
							disabled={uploading}
						/>

						{photoUrl && (
							<button
								type="button"
								onClick={handleDelete}
								disabled={deleting}
								className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
							>
								{deleting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Trash2 className="h-4 w-4" />
								)}
								Remove
							</button>
						)}
					</div>

					<p className="text-xs text-muted-foreground">
						JPEG, PNG, GIF, or WebP. Max 5 MB.
					</p>
				</div>
			</div>

			{error && (
				<p className="mt-3 text-sm text-destructive" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-sm text-muted-foreground">{label}</span>
			<span className="text-sm font-medium">{value}</span>
		</div>
	);
}
