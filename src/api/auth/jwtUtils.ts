export type AuthSession = {
  tokenType: "Bearer" | string;
  accessToken: string;
  expiresIn: number; // segundos
};

type StoredSession = {
  tokenType: string;
  accessToken: string;
  expiresAtMs: number; // epoch ms
};

const KEY = "operp.auth.session.v1";
let memory: StoredSession | null = null;

function nowMs() {
  return Date.now();
}

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function buildStoredSession(s: AuthSession): StoredSession {
  return {
    tokenType: s.tokenType,
    accessToken: s.accessToken,
    expiresAtMs: nowMs() + Math.max(0, s.expiresIn) * 1000,
  };
}

async function persistSession(stored: StoredSession): Promise<void> {
  const storage = getStorage();
  if (storage) {
    storage.setItem(KEY, JSON.stringify(stored));
  } else {
    memory = stored;
  }
}

export async function saveAuthSession(s: AuthSession): Promise<void> {
  await persistSession(buildStoredSession(s));
}

export async function getAuthSession(): Promise<StoredSession | null> {
  const storage = getStorage();
  if (storage) {
    const raw = storage.getItem(KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredSession;
    } catch {
      return null;
    }
  }
  return memory;
}

export async function clearAuthSession(): Promise<void> {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(KEY);
  }
  memory = null;
}

async function getValidSession(): Promise<StoredSession | null> {
  const s = await getAuthSession();
  if (!s) return null;
  if (!isExpired(s)) return s;
  await clearAuthSession();
  return null;
}

export async function getAccessToken(): Promise<string | null> {
  const s = await getValidSession();
  return s?.accessToken ?? null;
}

export async function getAuthorizationHeader(): Promise<string | null> {
  const s = await getValidSession();
  if (!s) return null;
  return `${s.tokenType} ${s.accessToken}`;
}

export async function isLoggedIn(): Promise<boolean> {
  const s = await getValidSession();
  return !!s;
}

function isExpired(s: StoredSession): boolean {
  // margen pequeño para evitar “caduca justo ahora”
  return s.expiresAtMs <= nowMs() + 10_000;
}
