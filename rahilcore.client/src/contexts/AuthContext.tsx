
import {
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { AuthContext, type AuthUser } from "./auth-context";

import type { ApiResponse } from "../types/api";

type AuthResponse = {
    id: string;
    username: string;
    displayName: string;
};

type ApiError = {
    message?: string;
};

async function readError(response: Response): Promise<string> {
    const body = await response.json().catch(() => null) as ApiError | null;

    return body?.message ?? `Request gagal (${response.status}).`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = user !== null;

    useEffect(() => {
        let active = true;

        async function loadSession() {
            try {
                const response = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (!active) return;

                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const body: ApiResponse<AuthResponse> = await response.json();

                if (active) {
                    setUser(body.data);
                }
            } catch {
                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }

        void loadSession();

        return () => {
            active = false;
        };
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(await readError(response));
        }

        const body: ApiResponse<AuthResponse> = await response.json();
        setUser(body.data);
    }, []);

    const logout = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(await readError(response));
            }
        } finally {
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
