import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import Dashboard from "./dashboard";

describe("Dashboard page", () => {
  function renderDashboard(user = { name: "Jane", email: "jane@test.com" }) {
    const Stub = createRoutesStub([
      {
        path: "/app",
        Component: Dashboard,
        loader() {
          return { user };
        },
      },
    ]);
    render(<Stub initialEntries={["/app"]} />);
  }

  it("renders the dashboard heading", async () => {
    renderDashboard();
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  it("shows welcome message with user name", async () => {
    renderDashboard({ name: "Alice", email: "alice@test.com" });
    expect(await screen.findByText(/Welcome back, Alice/)).toBeInTheDocument();
  });

  it("falls back to email when name is empty", async () => {
    renderDashboard({ name: "", email: "bob@test.com" });
    expect(await screen.findByText(/Welcome back, bob@test.com/)).toBeInTheDocument();
  });

  it("renders feature cards", async () => {
    renderDashboard();
    expect(await screen.findByText("Auth")).toBeInTheDocument();
    expect(screen.getByText("Database")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("describes each feature", async () => {
    renderDashboard();
    expect(await screen.findByText(/Magic link/)).toBeInTheDocument();
    expect(screen.getByText(/Cloudflare D1/)).toBeInTheDocument();
    expect(screen.getByText(/Resend/)).toBeInTheDocument();
  });
});
