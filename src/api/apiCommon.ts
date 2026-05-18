import { getAccessToken } from "./auth/jwtUtils";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const headers = new Headers(init.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}

export async function ensureOk(res: Response): Promise<void> {
  if (res.ok) return;

  const text = await res.text();
  let code = "UNKNOWN";

  if (text) {
    try {
      const data = JSON.parse(text) as { code?: string };
      if (data?.code) code = data.code;
    } catch {
      if (/^[A-Z_]+$/.test(text)) code = text;
    }
  }

  throw new Error(code);
}
