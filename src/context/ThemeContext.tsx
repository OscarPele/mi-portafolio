import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "operp.theme";

const parseTheme = (value: string | null): ThemeMode | null => {
  if (value === "light" || value === "dark") return value;
  return null;
};

const readStoredTheme = (): ThemeMode | null => {
  try {
    return parseTheme(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme() ?? "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== theme) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch {
      // Ignora errores de almacenamiento en contextos restringidos.
    }
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = parseTheme(event.newValue);
      if (!next) return;
      setTheme(next);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
