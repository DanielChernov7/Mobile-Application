import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Currency, FontSize, ThemeMode } from '../types';

const SETTINGS_KEY = '@cryptotracker_settings';

const defaultSettings: AppSettings = {
  currency: 'usd',
  fontSize: 'medium',
  theme: 'dark',
  defaultCategory: '',
};

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  setCurrency: (currency: Currency) => Promise<void>;
  setFontSize: (fontSize: FontSize) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setDefaultCategory: (category: string) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  };

  const setCurrency = useCallback(async (currency: Currency) => {
    await saveSettings({ ...settings, currency });
  }, [settings]);

  const setFontSize = useCallback(async (fontSize: FontSize) => {
    await saveSettings({ ...settings, fontSize });
  }, [settings]);

  const setTheme = useCallback(async (theme: ThemeMode) => {
    await saveSettings({ ...settings, theme });
  }, [settings]);

  const setDefaultCategory = useCallback(async (category: string) => {
    await saveSettings({ ...settings, defaultCategory: category });
  }, [settings]);

  const resetSettings = useCallback(async () => {
    await saveSettings(defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        setCurrency,
        setFontSize,
        setTheme,
        setDefaultCategory,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
