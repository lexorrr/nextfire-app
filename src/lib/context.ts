import { createContext } from "react";
import { User } from "./types/User";

export const UserContext = createContext({ user: {} as User, username: null });
