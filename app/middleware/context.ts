import { createContext } from "react-router";

// Shared types
export type SessionUser = {
	id: string;
	name: string;
	email: string;
	image: string | null;
};

export type Session = {
	user: SessionUser;
	session: { id: string; expiresAt: Date };
};

// Typed contexts — safe to import on client and server
export const sessionContext = createContext<Session | null>(null);
export const userContext = createContext<SessionUser>();
