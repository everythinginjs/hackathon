'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize from cookie or default to dark
  const [theme, setThemeState] = useState<Theme>(() => {
    const cookieTheme = getCookie('theme') as Theme | null;
    return cookieTheme || 'dark';
  });

  useEffect(() => {
    // Apply theme on mount and when it changes
    const cookieTheme = getCookie('theme') as Theme | null;
    const currentTheme = cookieTheme || 'dark';

    if (!cookieTheme) {
      // Set default dark mode in cookie if not set
      setCookie('theme', 'dark');
    }

    setThemeState(currentTheme);
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setCookie('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
