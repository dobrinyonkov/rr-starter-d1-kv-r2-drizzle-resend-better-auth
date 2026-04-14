import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MagicLinkEmail } from "./magic-link";

describe("MagicLinkEmail template", () => {
	it("renders without crashing", () => {
		const { container } = render(
			MagicLinkEmail({ url: "https://example.com/auth/verify?token=abc" }),
		);
		expect(container).toBeTruthy();
	});

	it("contains the sign-in link", () => {
		const { getByText } = render(
			MagicLinkEmail({ url: "https://example.com/auth/verify?token=abc" }),
		);
		const link = getByText("Sign in");
		expect(link).toHaveAttribute(
			"href",
			"https://example.com/auth/verify?token=abc",
		);
	});

	it("contains the heading", () => {
		const { getByText } = render(
			MagicLinkEmail({ url: "https://example.com" }),
		);
		expect(getByText("Sign in to Starter")).toBeTruthy();
	});

	it("contains expiry notice", () => {
		const { getByText } = render(
			MagicLinkEmail({ url: "https://example.com" }),
		);
		expect(getByText(/expires in 5 minutes/)).toBeTruthy();
	});

	it("contains safety disclaimer", () => {
		const { getByText } = render(
			MagicLinkEmail({ url: "https://example.com" }),
		);
		expect(getByText(/safely ignore/)).toBeTruthy();
	});
});
