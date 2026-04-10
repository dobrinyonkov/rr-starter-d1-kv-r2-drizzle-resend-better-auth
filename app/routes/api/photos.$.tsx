import { eq } from "drizzle-orm";
import { users } from "~/db/schema";
import { auth } from "~/lib/auth.server";
import { db } from "~/lib/db.server";
import {
	PHOTO_KEY_PREFIX,
	deletePhoto,
	getPhoto,
	uploadPhoto,
} from "~/lib/storage.server";

/**
 * GET /api/photos/:key+ — Serve a photo from R2.
 */
export async function loader({ params }: { params: { "*": string } }) {
	const key = params["*"];
	if (!key) {
		return new Response("Not found", { status: 404 });
	}

	const response = await getPhoto(key);
	if (!response) {
		return new Response("Not found", { status: 404 });
	}

	return response;
}

/**
 * POST /api/photos — Upload a photo and update user.image.
 * DELETE /api/photos — Remove the current photo.
 */
export async function action({ request }: { request: Request }) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = session.user;

	if (request.method === "POST") {
		return handleUpload(request, user);
	}

	if (request.method === "DELETE") {
		return handleDelete(user);
	}

	return Response.json({ error: "Method not allowed" }, { status: 405 });
}

async function handleUpload(
	request: Request,
	user: { id: string; image: string | null },
) {
	const formData = await request.formData();
	const file = formData.get("photo");

	if (!file || !(file instanceof File)) {
		return Response.json({ error: "No file provided" }, { status: 400 });
	}

	try {
		// Delete old photo if exists
		if (user.image?.startsWith(PHOTO_KEY_PREFIX)) {
			await deletePhoto(user.image);
		}

		// Upload new photo
		const { key } = await uploadPhoto(user.id, file);

		// Update user record with R2 key
		await db.update(users).set({ image: key }).where(eq(users.id, user.id));

		return Response.json({ key });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Upload failed";
		return Response.json({ error: message }, { status: 400 });
	}
}

async function handleDelete(user: {
	id: string;
	image: string | null;
}) {
	if (user.image?.startsWith(PHOTO_KEY_PREFIX)) {
		await deletePhoto(user.image);
	}

	await db.update(users).set({ image: null }).where(eq(users.id, user.id));

	return Response.json({ ok: true });
}
