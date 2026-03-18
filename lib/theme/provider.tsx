"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  defaultMode,
  defaultTheme,
  getThemeCSSVariables,
  type ThemeMode,
  type ThemeName,
  themes,
} from "@/lib/themes";

const THEME_STORAGE_KEY = "trainerai-theme";
const MODE_STORAGE_KEY = "trainerai-mode";

interface ThemeContextValue {
  theme: ThemeName;
  mode: ThemeMode;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): ThemeName {
  if (typeof window === "undefined") return defaultTheme;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && stored in themes) {
    return stored as ThemeName;
  }
  return defaultTheme;
}

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return defaultMode;
  const stored = localStorage.getItem(MODE_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return defaultMode;
}

function applyTheme(themeName: ThemeName, mode: ThemeMode) {
  const theme = themes[themeName];
  const colors = mode === "dark" ? theme.dark : theme.light;
  const cssVars = getThemeCSSVariables(colors);

  const root = document.documentElement;

  // Apply CSS variables
  for (const [key, value] of Object.entries(cssVars)) {
    root.style.setProperty(key, value);
  }

  // Toggle dark class for Tailwind
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // Set data attributes for potential CSS selectors
  root.dataset.theme = themeName;
  root.dataset.mode = mode;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme);
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [mounted, setMounted] = useState(false);

  // Initialize from storage on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    const storedMode = getStoredMode();
    setThemeState(storedTheme);
    setModeState(storedMode);
    applyTheme(storedTheme, storedMode);
    setMounted(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme, mode);
    }
  }, [theme, mode, mounted]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't explicitly set a mode
      const storedMode = localStorage.getItem(MODE_STORAGE_KEY);
      if (!storedMode) {
        const newMode = e.matches ? "dark" : "light";
        setModeState(newMode);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setTheme,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
