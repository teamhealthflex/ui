import React from 'react';
import { Appearance } from 'react-native';

import type { ThemeColors } from '@theme';
import { colors as defaultColors } from '@theme';

/**
 * Storage interface to be implemented by the user
 */
export interface Storage {
  /**
   * Get the value for a key
   * @param key The key to get the value for
   */
  getItem(key: string): string | null;

  /**
   * Set the value for a key
   * @param key The key to set the value for
   * @param value The value to set for the key
   */
  setItem(key: string, value: string): void;

  /**
   * Remove the value for a key
   * @param key The key to remove
   */
  removeItem(key: string): void;
}

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  storage: Storage;
  storageKey: string;
  defaultTheme: Theme;
  children: React.ReactNode;
  customColors?: Partial<Record<'dark' | 'light', ThemeColors>>;
};

type ThemeProviderState = {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  colors: defaultColors.light,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  storage,
  storageKey,
  defaultTheme,
  customColors = {},
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>('system');
  const [systemTheme, setSystemTheme] = React.useState<'dark' | 'light'>(
    Appearance.getColorScheme() || 'light',
  );

  const mergedColors = React.useMemo(() => {
    return {
      light: { ...defaultColors.light, ...customColors.light },
      dark: { ...defaultColors.dark, ...customColors.dark },
    };
  }, [customColors]);

  React.useEffect(() => {
    const loadTheme = () => {
      const savedTheme = storage.getItem(storageKey) as Theme | null;
      setTheme(savedTheme || defaultTheme);
    };

    loadTheme();

    const appearanceListener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme || 'light');
    });

    return () => appearanceListener.remove();
  }, [storage, storageKey, defaultTheme]);

  const activeTheme = React.useMemo(
    () => (theme === 'system' ? systemTheme : theme),
    [theme, systemTheme],
  );

  const value: ThemeProviderState = React.useMemo(
    () => ({
      theme: activeTheme,
      colors: mergedColors[activeTheme],
      setTheme: (newTheme: Theme) => {
        storage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      },
    }),
    [activeTheme, mergedColors, storage, storageKey],
  );

  return (
    <>
      <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
    </>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
