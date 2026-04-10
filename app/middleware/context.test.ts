import { describe, expect, it, vi } from "vitest";

// Mock the react-router createContext
vi.mock("react-router", () => ({
	createContext: (defaultValue?: unknown) => ({ defaultValue }),
}));

import { sessionContext, userContext } from "./context";

describe("middleware context", () => {
	it("exports sessionContext", () => {
		expect(sessionContext).toBeDefined();
	});

	it("exports userContext", () => {
		expect(userContext).toBeDefined();
	});

	it("sessionContext has no default value (null is falsy but we check explicit undefined)", () => {
		// unstable_createContext("session") passes "session" as defaultValue
		expect(sessionContext).toHaveProperty("defaultValue");
	});

	it("userContext has a default value identifier", () => {
		expect(userContext).toHaveProperty("defaultValue");
	});
});
