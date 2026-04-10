import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import SignIn from "./sign-in";

describe("Sign-in page", () => {
  function renderSignIn(searchParams = "") {
    const Stub = createRoutesStub([
      {
        path: "/sign-in",
        Component: SignIn,
      },
      {
        path: "/app",
        Component: () => <div>App</div>,
      },
    ]);
    render(<Stub initialEntries={[`/sign-in${searchParams}`]} />);
  }

  it("renders the sign-in heading", async () => {
    renderSignIn();
    expect(await screen.findByText("Sign in")).toBeInTheDocument();
  });

  it("renders the subtitle", async () => {
    renderSignIn();
    expect(
      await screen.findByText("Choose your preferred sign-in method"),
    ).toBeInTheDocument();
  });

  it("shows GitHub sign-in button", async () => {
    renderSignIn();
    expect(
      await screen.findByText("Continue with GitHub"),
    ).toBeInTheDocument();
  });

  it("shows email input for magic link", async () => {
    renderSignIn();
    expect(await screen.findByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("you@example.com"),
    ).toBeInTheDocument();
  });

  it("shows send magic link button", async () => {
    renderSignIn();
    expect(await screen.findByText("Send magic link")).toBeInTheDocument();
  });

  it("has a divider between auth methods", async () => {
    renderSignIn();
    expect(await screen.findByText("or")).toBeInTheDocument();
  });

  it("email input is required", async () => {
    renderSignIn();
    const input = await screen.findByLabelText("Email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("type", "email");
  });
});
