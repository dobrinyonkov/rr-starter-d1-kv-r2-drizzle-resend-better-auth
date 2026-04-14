import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import AppLayout from "./layout";

describe("App layout", () => {
	function renderLayout() {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: AppLayout,
				children: [
					{
						path: "app",
						Component: () => <div>Child content</div>,
					},
					{
						path: "app/notes",
						Component: () => <div>Notes page</div>,
					},
					{
						path: "app/settings",
						Component: () => <div>Settings page</div>,
					},
				],
			},
			{
				path: "/sign-out",
				action() {
					return { ok: true };
				},
				Component: () => null,
			},
		]);
		render(<Stub initialEntries={["/app"]} />);
	}

	it("renders the app name in sidebar", async () => {
		renderLayout();
		// Desktop sidebar + mobile header both have "Starter"
		const links = await screen.findAllByText("Starter");
		expect(links.length).toBeGreaterThanOrEqual(1);
	});

	it("renders navigation links", async () => {
		renderLayout();
		// Desktop sidebar + mobile bottom nav both render the nav links
		expect(await screen.findAllByText("Dashboard")).toHaveLength(2);
		expect(screen.getAllByText("Notes")).toHaveLength(2);
		expect(screen.getAllByText("Settings")).toHaveLength(2);
	});

	it("renders sign out button", async () => {
		renderLayout();
		const buttons = await screen.findAllByText("Sign out");
		expect(buttons.length).toBeGreaterThanOrEqual(1);
	});

	it("renders child content", async () => {
		renderLayout();
		expect(await screen.findByText("Child content")).toBeInTheDocument();
	});
});
