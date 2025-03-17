import { Platform } from 'react-native';

// Define the app color palette
export const colors = {
  primary: {
    light: '#4E9FFF',
    default: '#2E81E8',
    dark: '#1E6AC2',
  },
  secondary: {
    light: '#FF9E60',
    default: '#FF8A3A',
    dark: '#E86D20',
  },
  neutrals: {
    white: '#FFFFFF',
    lightGray: '#F5F6F8',
    gray: '#E1E3E8',
    mediumGray: '#BCC1CA',
    darkGray: '#6E7787',
    charcoal: '#383C45',
    black: '#121417',
  },
  feedback: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  background: {
    light: '#FFFFFF',
    dark: '#121417',
  },
  text: {
    primary: '#121417',
    secondary: '#6E7787',
    disabled: '#BCC1CA',
    inverse: '#FFFFFF',
  },
};

// Typography
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  families: {
    primary: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  pill: 1000,
};

// Shadows
export const shadows = Platform.select({
  ios: {
    sm: {
      shadowColor: colors.neutrals.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    md: {
      shadowColor: colors.neutrals.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    lg: {
      shadowColor: colors.neutrals.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  },
  android: {
    sm: { elevation: 2 },
    md: { elevation: 4 },
    lg: { elevation: 8 },
  },
  default: {
    sm: {
      shadowColor: colors.neutrals.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    md: {
      shadowColor: colors.neutrals.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    lg: {
      shadowColor: colors.neutrals.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  },
});

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
}; 