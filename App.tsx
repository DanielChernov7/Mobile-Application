import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  SettingsProvider,
  ThemeProvider,
  FavoritesProvider,
  useSettings,
  useTheme,
} from './src/context';
import { AppNavigator } from './src/navigation';

function AppContent() {
  const { isLoading } = useSettings();
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

function AppWithTheme() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppWithTheme />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
