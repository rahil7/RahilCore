
import type { ApiResponse } from "../types/api";

async function readError(response: Response): Promise<string> {
    const body = await response.json().catch(() => null) as {
        message?: string;
    } | null;

    return body?.message ?? `Request gagal (${response.status}).`;
}

async function request<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.body != null
                ? { "Content-Type": "application/json" }
                : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const apiClient = {
    get<T>(url: string): Promise<T> {
        return request<T>(url, {
            method: "GET",
        });
    },

    post<T>(url: string, data?: unknown): Promise<T> {
        return request<T>(url, {
            method: "POST",
            ...(data !== undefined
                ? { body: JSON.stringify(data) }
                : {}),
        });
    },

    patch<T>(url: string, data: unknown): Promise<T> {
        return request<T>(url, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    put<T>(url: string, data: unknown): Promise<T> {
        return request<T>(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete<T>(url: string): Promise<T> {
        return request<T>(url, {
            method: "DELETE",
        });
    },
};

export type { ApiResponse };
