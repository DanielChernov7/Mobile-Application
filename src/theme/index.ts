import { FontSize } from '../types';

// Color palettes
export const lightColors = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  border: '#e2e8f0',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  positive: '#16a34a',
  negative: '#dc2626',
  icon: '#64748b',
  cardShadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  ripple: 'rgba(99, 102, 241, 0.12)',
};

export const darkColors = {
  primary: '#818cf8',
  primaryLight: '#a5b4fc',
  primaryDark: '#6366f1',
  background: '#0f172a',
  surface: '#1e293b',
  surfaceVariant: '#334155',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  border: '#334155',
  error: '#f87171',
  success: '#4ade80',
  warning: '#fbbf24',
  positive: '#4ade80',
  negative: '#f87171',
  icon: '#94a3b8',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  ripple: 'rgba(129, 140, 248, 0.2)',
};

export type Colors = typeof lightColors;

// Typography scales based on font size setting
const baseTypography = {
  small: {
    displayLarge: 28,
    displayMedium: 24,
    displaySmall: 20,
    headlineLarge: 18,
    headlineMedium: 16,
    headlineSmall: 14,
    bodyLarge: 14,
    bodyMedium: 12,
    bodySmall: 10,
    labelLarge: 12,
    labelMedium: 10,
    labelSmall: 9,
  },
  medium: {
    displayLarge: 32,
    displayMedium: 28,
    displaySmall: 24,
    headlineLarge: 22,
    headlineMedium: 18,
    headlineSmall: 16,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    labelLarge: 14,
    labelMedium: 12,
    labelSmall: 10,
  },
  large: {
    displayLarge: 38,
    displayMedium: 32,
    displaySmall: 28,
    headlineLarge: 26,
    headlineMedium: 22,
    headlineSmall: 18,
    bodyLarge: 18,
    bodyMedium: 16,
    bodySmall: 14,
    labelLarge: 16,
    labelMedium: 14,
    labelSmall: 12,
  },
};

export type Typography = typeof baseTypography.medium;

export const getTypography = (size: FontSize): Typography => baseTypography[size];

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radius
export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

// Shadow presets
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Complete theme object
export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  dark: boolean;
}

export const createTheme = (dark: boolean, fontSize: FontSize): Theme => ({
  colors: dark ? darkColors : lightColors,
  typography: getTypography(fontSize),
  spacing,
  borderRadius,
  shadows,
  dark,
});
