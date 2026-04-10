import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import SettingsPage from "./settings";

const mockUser = {
	id: "user-123",
	name: "Jane Doe",
	email: "jane@test.com",
	image: null,
};

const mockSessions = [
	{
		id: "sess-1",
		token: "tok-1",
		userAgent: "Mozilla/5.0 Chrome/120",
		ipAddress: "192.168.1.1",
		expiresAt: new Date(Date.now() + 86400000).toISOString(),
		createdAt: new Date().toISOString(),
	},
	{
		id: "sess-2",
		token: "tok-2",
		userAgent: null,
		ipAddress: null,
		expiresAt: new Date(Date.now() + 86400000).toISOString(),
		createdAt: new Date().toISOString(),
	},
];

describe("Settings page", () => {
	function renderSettings(user = mockUser, sessions = mockSessions) {
		const Stub = createRoutesStub([
			{
				path: "/app/settings",
				Component: SettingsPage,
				loader() {
					return { user, sessions };
				},
			},
		]);
		render(<Stub initialEntries={["/app/settings"]} />);
	}

	it("renders the settings heading", async () => {
		renderSettings();
		expect(await screen.findByText("Settings")).toBeInTheDocument();
	});

	it("shows profile info", async () => {
		renderSettings();
		expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
		expect(screen.getByText("jane@test.com")).toBeInTheDocument();
		expect(screen.getByText("user-123")).toBeInTheDocument();
	});

	it("displays active sessions with user agent", async () => {
		renderSettings();
		expect(
			await screen.findByText("Mozilla/5.0 Chrome/120"),
		).toBeInTheDocument();
		expect(screen.getByText(/192\.168\.1\.1/)).toBeInTheDocument();
	});

	it("shows unknown device for sessions without user agent", async () => {
		renderSettings();
		expect(await screen.findByText("Unknown device")).toBeInTheDocument();
		expect(screen.getByText(/Unknown IP/)).toBeInTheDocument();
	});

	it("shows empty state when no sessions", async () => {
		renderSettings(mockUser, []);
		expect(await screen.findByText("No active sessions.")).toBeInTheDocument();
	});

	it("shows dash for missing name", async () => {
		renderSettings({ ...mockUser, name: "" });
		// The name row should show "—" for empty name
		expect(await screen.findByText("—")).toBeInTheDocument();
	});

	// Photo upload tests
	it("renders the photo upload section", async () => {
		renderSettings();
		expect(await screen.findByText("Profile photo")).toBeInTheDocument();
		expect(screen.getByText("Upload photo")).toBeInTheDocument();
		expect(
			screen.getByText("JPEG, PNG, GIF, or WebP. Max 5 MB."),
		).toBeInTheDocument();
	});

	it("shows initials when no photo is set", async () => {
		renderSettings();
		// "JD" for "Jane Doe"
		expect(await screen.findByText("JD")).toBeInTheDocument();
	});

	it("shows the file input for photo upload", async () => {
		renderSettings();
		await screen.findByText("Upload photo");
		const input = document.getElementById("photo-upload") as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.type).toBe("file");
		expect(input.accept).toBe("image/jpeg,image/png,image/gif,image/webp");
	});

	it("does not show remove button when no photo", async () => {
		renderSettings();
		await screen.findByText("Upload photo");
		expect(screen.queryByText("Remove")).not.toBeInTheDocument();
	});

	it("shows remove button when photo is set", async () => {
		renderSettings({ ...mockUser, image: "photos/user-123/photo.jpg" });
		expect(await screen.findByText("Remove")).toBeInTheDocument();
	});

	it("renders the user photo when image is an R2 key", async () => {
		renderSettings({ ...mockUser, image: "photos/user-123/photo.jpg" });
		await screen.findByText("Upload photo");
		const img = screen.getByAltText("Profile avatar") as HTMLImageElement;
		expect(img).toBeInTheDocument();
		expect(img.src).toContain("/api/photos/photos/user-123/photo.jpg");
	});

	it("renders the user photo when image is an external URL", async () => {
		renderSettings({
			...mockUser,
			image: "https://example.com/photo.jpg",
		});
		await screen.findByText("Upload photo");
		const img = screen.getByAltText("Profile avatar") as HTMLImageElement;
		expect(img).toBeInTheDocument();
		expect(img.src).toBe("https://example.com/photo.jpg");
	});
});
