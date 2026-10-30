export interface AuthUser {
    id: string;
    email: string;
    displayName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}