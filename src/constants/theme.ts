import { Colors, Spacing, BorderRadius, Typography } from '../types';

export const COLORS: Colors = {
  primary: '#2c2c2e',
  secondary: '#6d6d70',
  background: '#f2f2f7',
  surface: '#ffffff',
  border: '#e5e5ea',
  error: '#8e8e93',
  success: '#6d6d70',
  warning: '#8e8e93',
  info: '#6d6d70',
  text: {
    primary: '#1c1c1e',
    secondary: '#6d6d70',
    disabled: '#c7c7cc',
  },
  shadow: {
    color: '#000',
    offset: { width: 0, height: 1 },
    opacity: 0.05,
    radius: 3,
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
