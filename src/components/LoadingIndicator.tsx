import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context';

interface LoadingIndicatorProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingIndicator({
  message = 'Loading...',
  fullScreen = false,
}: LoadingIndicatorProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xxl,
    },
    fullScreen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    message: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.bodyMedium,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}
