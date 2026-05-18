import { API_BASE_URL } from "../apiCommon";

type RegisterBody = {
  username: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  id: string | number;
  username: string;
  email: string;
  enabled: boolean;
  createdAt: string;
};

export async function register(body: RegisterBody): Promise<RegisterResponse> {
  if (!API_BASE_URL) {
    throw new Error("Falta API_BASE_URL en tu configuración.");
  }

  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    let code: string | null = data?.code ?? null;
    if (!code && text && /^[A-Z_]+$/.test(text)) {
      code = text;
    }
    throw new Error(code ?? "UNKNOWN");
  }

  return data as RegisterResponse;
}

export async function resendVerificationEmail(email: string): Promise<void> {
  if (!API_BASE_URL) {
    throw new Error("Falta VITE_API_BASE_URL en tu configuración.");
  }

  const res = await fetch(`${API_BASE_URL}/auth/verify-email/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
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
}
