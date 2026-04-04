const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function authRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options?.headers },
  });
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: optHeaders, ...restOptions } = options ?? {};

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...optHeaders,
    },
    ...restOptions,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.code ?? body.message ?? body.error ?? res.statusText);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}
