import { API_BASE_URL } from "../apiCommon";

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type LoginResponse = {
  tokenType: "Bearer" | string;
  accessToken: string;
  expiresIn: number;
};

export async function login(body: LoginRequest): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    throw new Error("Falta VITE_API_BASE_URL en tu configuración.");
  }

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let code = "UNKNOWN";

    if (text) {
      try {
        const data = JSON.parse(text) as { code?: string };
        if (data?.code) code = data.code;
      } catch {
        if (/^[A-Z_]+$/.test(text)) {
          code = text;
        }
      }
    }

    throw new Error(code);
  }

  return (await res.json()) as LoginResponse;
}
