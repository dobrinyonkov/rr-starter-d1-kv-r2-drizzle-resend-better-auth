import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import AuthLayout from "./layout";

describe("Auth layout", () => {
  it("renders children in a centered container", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: AuthLayout,
        children: [
          {
            index: true,
            Component: () => <div>Auth content</div>,
          },
        ],
      },
    ]);
    render(<Stub initialEntries={["/"]} />);
    expect(await screen.findByText("Auth content")).toBeInTheDocument();
  });
});
