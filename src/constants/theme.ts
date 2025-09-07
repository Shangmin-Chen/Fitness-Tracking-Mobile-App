import { Colors, Spacing, BorderRadius, Typography } from '../types';

export const COLORS: Colors = {
  primary: '#1a1a1a',
  secondary: '#8e8e93',
  background: '#fafafa',
  surface: '#ffffff',
  border: '#f2f2f7',
  error: '#FF3B30',
  success: '#4CAF50',
  warning: '#FF9500',
  info: '#007AFF',
  text: {
    primary: '#1a1a1a',
    secondary: '#8e8e93',
    disabled: '#c7c7cc',
  },
  shadow: {
    color: '#000',
    offset: { width: 0, height: 1 },
    opacity: 0.03,
    radius: 2,
  },
};

export const SPACING: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const BORDER_RADIUS: BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const TYPOGRAPHY: Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h4: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
};
