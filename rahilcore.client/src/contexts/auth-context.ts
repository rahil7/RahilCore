
import { createContext } from "react";

export interface AuthUser {
    id: string;
    username: string;
    displayName: string;
}

export type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
