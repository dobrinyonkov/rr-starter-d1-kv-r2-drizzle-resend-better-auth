import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import NotFound from "./$.tsx";

describe("404 page", () => {
	it("renders 404 heading", async () => {
		const Stub = createRoutesStub([{ path: "*", Component: NotFound }]);
		render(<Stub initialEntries={["/nonexistent"]} />);
		expect(screen.getByText("404")).toBeInTheDocument();
	});

	it("renders page not found message", async () => {
		const Stub = createRoutesStub([{ path: "*", Component: NotFound }]);
		render(<Stub initialEntries={["/nonexistent"]} />);
		expect(screen.getByText("Page not found.")).toBeInTheDocument();
	});

	it("has a go home link", async () => {
		const Stub = createRoutesStub([
			{ path: "*", Component: NotFound },
			{ path: "/", Component: () => <div>Home</div> },
		]);
		render(<Stub initialEntries={["/nonexistent"]} />);
		const link = screen.getByText("Go home");
		expect(link).toBeInTheDocument();
	});
});
