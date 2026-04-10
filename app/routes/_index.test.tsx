import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import Home from "./_index";

describe("Landing page", () => {
  it("renders the heading", async () => {
    const Stub = createRoutesStub([
      { path: "/", Component: Home },
    ]);
    render(<Stub initialEntries={["/"]} />);
    expect(
      screen.getByText("React Router + Cloudflare Starter"),
    ).toBeInTheDocument();
  });

  it("renders a get started link", async () => {
    const Stub = createRoutesStub([
      { path: "/", Component: Home },
      { path: "/sign-in", Component: () => null },
    ]);
    render(<Stub initialEntries={["/"]} />);
    expect(screen.getByText("Get started")).toBeInTheDocument();
  });

  it("renders a GitHub link", async () => {
    const Stub = createRoutesStub([
      { path: "/", Component: Home },
    ]);
    render(<Stub initialEntries={["/"]} />);
    const link = screen.getByText("GitHub");
    expect(link).toHaveAttribute("href", "https://github.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("includes the tech stack description", async () => {
    const Stub = createRoutesStub([
      { path: "/", Component: Home },
    ]);
    render(<Stub initialEntries={["/"]} />);
    expect(screen.getByText(/Better Auth/)).toBeInTheDocument();
    expect(screen.getByText(/Drizzle/)).toBeInTheDocument();
    expect(screen.getByText(/Resend/)).toBeInTheDocument();
  });
});
