import { env } from "cloudflare:workers";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const PHOTO_KEY_PREFIX = "photos/";

const MIME_TO_EXT: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/gif": "gif",
	"image/webp": "webp",
};

/**
 * Upload a user photo to R2 and return the object key.
 * The key follows the pattern: `photos/{userId}/{timestamp}.{ext}`
 */
export async function uploadPhoto(
	userId: string,
	file: File,
): Promise<{ key: string }> {
	if (!ALLOWED_TYPES.includes(file.type)) {
		throw new Error("Invalid file type. Allowed: JPEG, PNG, GIF, WebP.");
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new Error("File too large. Maximum size is 5 MB.");
	}

	const ext = MIME_TO_EXT[file.type] ?? "bin";
	const key = `${PHOTO_KEY_PREFIX}${userId}/${Date.now()}.${ext}`;

	await env.R2.put(key, await file.arrayBuffer(), {
		httpMetadata: { contentType: file.type },
	});

	return { key };
}

/**
 * Delete a photo from R2 by its object key.
 */
export async function deletePhoto(key: string): Promise<void> {
	await env.R2.delete(key);
}

/**
 * Get a photo from R2 and return it as a Response for serving.
 */
export async function getPhoto(key: string): Promise<Response | null> {
	const object = await env.R2.get(key);
	if (!object) return null;

	const metadata = object.httpMetadata as { contentType?: string } | undefined;
	const contentType = metadata?.contentType ?? "application/octet-stream";

	const headers = new Headers();
	headers.set("Content-Type", contentType);
	headers.set("Cache-Control", "public, max-age=31536000, immutable");

	return new Response(object.body as ReadableStream, { headers });
}
