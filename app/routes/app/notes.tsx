import { desc, eq } from "drizzle-orm";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { notes } from "~/db/schema";
import { db } from "~/lib/db.server";
import { userContext } from "~/middleware/context";

// Load all notes for the current user
export async function loader({ context }: { context: { get: Function } }) {
	const user = context.get(userContext);
	const userNotes = await db.query.notes.findMany({
		where: eq(notes.userId, user.id),
		orderBy: [desc(notes.createdAt)],
	});
	return { notes: userNotes };
}

// Handle create and delete actions
export async function action({
	request,
	context,
}: { request: Request; context: { get: Function } }) {
	const user = context.get(userContext);
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "create") {
		const title = formData.get("title") as string;
		const content = formData.get("content") as string;
		if (!title?.trim()) return { error: "Title is required" };

		await db.insert(notes).values({
			title: title.trim(),
			content: content?.trim() || "",
			userId: user.id,
		});
	}

	if (intent === "delete") {
		const noteId = formData.get("noteId") as string;
		await db.delete(notes).where(eq(notes.id, noteId));
	}

	return { ok: true };
}

type Note = {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
};

export default function NotesPage({
	loaderData,
}: {
	loaderData: { notes: Note[] };
}) {
	const { notes } = loaderData;
	const [showForm, setShowForm] = useState(false);
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<div className="space-y-6 max-w-2xl">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Notes</h1>
					<p className="text-muted-foreground">
						A simple CRUD demo using D1 + Drizzle.
					</p>
				</div>
				<button
					type="button"
					onClick={() => setShowForm(!showForm)}
					className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
				>
					<Plus className="h-4 w-4" />
					New note
				</button>
			</div>

			{/* Create form */}
			{showForm && (
				<Form
					method="post"
					onSubmit={() => setTimeout(() => setShowForm(false), 100)}
					className="rounded-lg border bg-card p-4 space-y-3"
				>
					<input type="hidden" name="intent" value="create" />
					<div className="space-y-1.5">
						<label htmlFor="title" className="text-sm font-medium">
							Title
						</label>
						<input
							id="title"
							name="title"
							required
							placeholder="Note title"
							className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
					</div>
					<div className="space-y-1.5">
						<label htmlFor="content" className="text-sm font-medium">
							Content
						</label>
						<textarea
							id="content"
							name="content"
							rows={3}
							placeholder="Write something..."
							className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
					</div>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={() => setShowForm(false)}
							className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
						>
							{isSubmitting && <Loader2 className="h-3 w-3 animate-spin" />}
							Create
						</button>
					</div>
				</Form>
			)}

			{/* Notes list */}
			{notes.length === 0 ? (
				<div className="rounded-lg border bg-card p-8 text-center">
					<p className="text-sm text-muted-foreground">
						No notes yet. Create your first one!
					</p>
				</div>
			) : (
				<div className="rounded-lg border bg-card divide-y">
					{notes.map((note) => (
						<div
							key={note.id}
							className="flex items-start justify-between gap-4 p-4"
						>
							<div className="min-w-0 flex-1">
								<h3 className="font-medium">{note.title}</h3>
								{note.content && (
									<p className="mt-1 text-sm text-muted-foreground line-clamp-2">
										{note.content}
									</p>
								)}
								<p className="mt-1 text-xs text-muted-foreground">
									{new Date(note.createdAt).toLocaleDateString()}
								</p>
							</div>
							<Form method="post">
								<input type="hidden" name="intent" value="delete" />
								<input type="hidden" name="noteId" value={note.id} />
								<button
									type="submit"
									className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
									title="Delete"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</Form>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
