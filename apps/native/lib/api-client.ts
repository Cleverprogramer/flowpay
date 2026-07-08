import { env } from "@flowpay/env/native";
import { hc } from "hono/client";
import type { AppType } from "server";
import { authClient } from "./auth-client";

const BASE_URL = env.EXPO_PUBLIC_SERVER_URL;

async function getSessionCookie(): Promise<string | null> {
  try {
    const cookie = authClient.getCookie();
    return cookie || null;
  } catch (error) {
    console.error("Error in getSessionCookie", error);
    return null;
  }
}

async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const cookie = await getSessionCookie();
  const headers = new Headers(init?.headers);

  if (cookie) {
    headers.set("Cookie", cookie);
  }

  return fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
}

export const api = hc<AppType>(BASE_URL, {
  fetch: authFetch,
});

// ── Legacy API client (keep for backward compatibility) ─────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const cookie = await getSessionCookie();
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
        ...options.headers,
      },
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        // If parsing fails, use default message
      }
      throw new ApiError(errorMessage, response.status);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error", 0, "NETWORK_ERROR");
  }
}

export const apiClient = {
  get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
