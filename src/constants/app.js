// App-wide constants
export const APP_CONFIG = {
  name: '2Plates',
  version: '1.0.0',
  storageKeys: {
    workoutLogs: 'workoutLogs',
  },
};

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const ACCESSIBILITY = {
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

export const LAYOUT = {
  screenPadding: 16,
  cardPadding: 20,
  buttonHeight: {
    small: 32,
    medium: 44,
    large: 56,
  },
};

export const PERFORMANCE = {
  debounceDelay: 300,
  throttleDelay: 100,
  maxRetries: 3,
};
