import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { Theme, createTheme } from '../theme';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings } = useSettings();

  const theme = useMemo(() => {
    return createTheme(settings.theme === 'dark', settings.fontSize);
  }, [settings.theme, settings.fontSize]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
}
