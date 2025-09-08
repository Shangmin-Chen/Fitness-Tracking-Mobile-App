import { ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

// Base types
export type ID = string | number;

// Common component props
export interface BaseProps {
  style?: ViewStyle | ViewStyle[];
  children?: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

// Button types
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends BaseProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  textStyle?: TextStyle | TextStyle[];
}

// Header types
export interface HeaderProps extends BaseProps {
  title: string;
  subtitle?: string;
  pattern?: ReactNode;
}

// Workout related types
export interface WorkoutSet {
  id: ID;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}

export interface Exercise {
  id: ID;
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: ID;
  exercises: Exercise[];
  date: string;
  completedAt?: string;
  dateKey: string;
}

// Exercise library types
export type ExerciseCategory = 'All' | 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ExerciseInfo {
  name: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  muscle: string;
  description: string;
}

// Navigation types
export interface NavigationProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
    reset: (state: any) => void;
  };
}

// Hook return types
export interface WorkoutStats {
  todayWorkouts: number;
  thisWeek: number;
  thisMonth: number;
  totalWorkouts: number;
  totalExercises: number;
  streak: number;
  averageWorkoutDuration: number;
}

export interface UseWorkoutDataReturn {
  workoutLogs: Record<string, Workout>;
  loading: boolean;
  error: Error | null;
  loadData: () => Promise<void>;
  saveWorkoutLogs: (logs: Record<string, Workout>) => Promise<void>;
  addWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (dateKey: string) => Promise<void>;
  getWorkoutStats: () => WorkoutStats;
  getRecentWorkouts: (limit?: number) => Workout[];
  workoutStats: WorkoutStats;
  recentWorkouts: Workout[];
}

// Action card types
export interface ActionCardProps extends BaseProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}

// Stat card types
export interface StatCardProps extends BaseProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
}

// Modal types
export interface ModalProps extends BaseProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  animationType?: 'slide' | 'fade' | 'none';
}

// Error boundary types
export interface ErrorBoundaryProps extends BaseProps {
  showRetry?: boolean;
}

// Performance monitor types
export interface PerformanceData {
  renderTime: number;
  memoryUsage: number;
  timestamp: number;
}

// Theme types
export interface Colors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  shadow: {
    color: string;
    offset: { width: number; height: number };
    opacity: number;
    radius: number;
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface Typography {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

// App config types
export interface AppConfig {
  name: string;
  version: string;
  storageKeys: {
    workoutLogs: string;
  };
}

export interface AnimationDuration {
  fast: number;
  normal: number;
  slow: number;
}

export interface AccessibilityConfig {
  roles: {
    button: string;
    header: string;
    text: string;
    image: string;
  };
  labels: {
    retry: string;
    close: string;
    save: string;
    delete: string;
    add: string;
  };
}

export interface LayoutConfig {
  screenPadding: number;
  cardPadding: number;
  buttonHeight: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface PerformanceConfig {
  debounceDelay: number;
  throttleDelay: number;
  maxRetries: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
