import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import Home from "./_index";

describe("Landing page", () => {
	it("renders the heading", async () => {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Home,
				loader: () => ({ session: null }),
			},
		]);
		render(<Stub initialEntries={["/"]} />);
		expect(
			await screen.findByText("React Router + Cloudflare Starter"),
		).toBeInTheDocument();
	});

	it("renders a get started link when not logged in", async () => {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Home,
				loader: () => ({ session: null }),
			},
			{ path: "/sign-in", Component: () => null },
		]);
		render(<Stub initialEntries={["/"]} />);
		expect(await screen.findByText("Get started")).toBeInTheDocument();
	});

	it("renders go to dashboard link when logged in", async () => {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Home,
				loader: () => ({
					session: {
						user: {
							id: "1",
							name: "Test User",
							email: "test@example.com",
							image: null,
						},
						session: { id: "session-1", expiresAt: new Date() },
					},
				}),
			},
			{ path: "/app", Component: () => null },
		]);
		render(<Stub initialEntries={["/"]} />);
		expect(await screen.findByText("Go to Dashboard")).toBeInTheDocument();
	});

	it("renders a GitHub link", async () => {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Home,
				loader: () => ({ session: null }),
			},
		]);
		render(<Stub initialEntries={["/"]} />);
		const link = await screen.findByText("GitHub");
		expect(link).toHaveAttribute("href", "https://github.com");
		expect(link).toHaveAttribute("target", "_blank");
	});

	it("includes the tech stack description", async () => {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Home,
				loader: () => ({ session: null }),
			},
		]);
		render(<Stub initialEntries={["/"]} />);
		expect(await screen.findByText(/Better Auth/)).toBeInTheDocument();
		expect(screen.getByText(/Drizzle/)).toBeInTheDocument();
		expect(screen.getByText(/Resend/)).toBeInTheDocument();
	});
});
