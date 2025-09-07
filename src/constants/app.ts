import { AppConfig, AnimationDuration, AccessibilityConfig, LayoutConfig, PerformanceConfig } from '../types';

// App-wide constants
export const APP_CONFIG: AppConfig = {
  name: '2Plates',
  version: '1.0.0',
  storageKeys: {
    workoutLogs: 'workoutLogs',
  },
};

export const ANIMATION_DURATION: AnimationDuration = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const ACCESSIBILITY: AccessibilityConfig = {
  roles: {
    button: 'button',
    header: 'header',
    text: 'text',
    image: 'image',
  },
  labels: {
    retry: 'Retry',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    add: 'Add',
  },
};

export const LAYOUT: LayoutConfig = {
  screenPadding: 16,
  cardPadding: 20,
  buttonHeight: {
    small: 32,
    medium: 44,
    large: 56,
  },
};

export const PERFORMANCE: PerformanceConfig = {
  debounceDelay: 300,
  throttleDelay: 100,
  maxRetries: 3,
};
