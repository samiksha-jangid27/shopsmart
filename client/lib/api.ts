import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type FetchOptions = RequestInit & { auth?: boolean };

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth && typeof window === "undefined") {
    const cookieStore = await cookies();
    const token = cookieStore.get("shopsmart_session")?.value;
    if (token) headers.set("Cookie", `shopsmart_session=${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: options.cache ?? "no-store"
  });

  if (!response.ok) {
    console.error("API error:", response.status);
    return {} as T;
  }

  return response.json() as Promise<T>;
}