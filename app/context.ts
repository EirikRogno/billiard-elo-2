import { createContext } from "react-router";
import type { Session } from "./lib/auth.server";

export const userContext = createContext<Session | null>(null);
