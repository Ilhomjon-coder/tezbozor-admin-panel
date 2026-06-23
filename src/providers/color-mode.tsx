import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';

// Light/dark mode for the admin panel. Persisted to localStorage; falls back to
// the OS preference and live-follows it until the operator makes an explicit
// choice. The chosen mode drives both the AntD theme algorithm (buildTheme) and
// a body[data-theme] attribute used by index.css for the page background.

export type ColorMode = 'light' | 'dark';

const STORAGE_KEY = 'tz_admin_theme';

interface ColorModeContextValue {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggle: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  setMode: () => undefined,
  toggle: () => undefined,
});

export function useColorMode(): ColorModeContextValue {
  return useContext(ColorModeContext);
}

function savedMode(): ColorMode | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

function initialMode(): ColorMode {
  return savedMode() ?? (systemPrefersDark() ? 'dark' : 'light');
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>(initialMode);

  // Reflect the mode on <body> before paint so index.css can colour the page.
  useLayoutEffect(() => {
    document.body.dataset.theme = mode;
  }, [mode]);

  // Follow the OS theme until the operator picks one explicitly (no saved key).
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => {
      if (savedMode()) return;
      setModeState(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setMode = (next: ColorMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — keep the choice in memory only */
    }
    setModeState(next);
  };

  return (
    <ColorModeContext.Provider value={{ mode, setMode, toggle: () => setMode(mode === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ColorModeContext.Provider>
  );
}
