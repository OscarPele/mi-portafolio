import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const TOKEN_KEY = 'demo1_token';

interface CurrentUser {
  uid: number;
  username: string;
}

interface AuthContextValue {
  token: string | null;
  currentUser: CurrentUser | null;
  saveToken: (token: string) => void;
  clearToken: () => void;
  isAuthenticated: boolean;
}

function parseToken(token: string): CurrentUser | null {
  try {
    const [, rawPayload] = token.split('.');
    if (!rawPayload) return null;

    const normalized = rawPayload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');
    const payload = JSON.parse(atob(padded));
    return { uid: Number(payload.uid), username: String(payload.sub) };
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const saveToken = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const clearToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(() => ({
    token,
    currentUser: token ? parseToken(token) : null,
    saveToken,
    clearToken,
    isAuthenticated: !!token,
  }), [token, saveToken, clearToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
