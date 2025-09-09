# 2Plates - Developer Guide & Codebase Documentation

## 📖 **Table of Contents**
1. [Project Overview](#project-overview)
2. [Codebase Architecture](#codebase-architecture)
3. [Directory Structure](#directory-structure)
4. [TypeScript Implementation Rules](#typescript-implementation-rules)
5. [Component Development Guidelines](#component-development-guidelines)
6. [Navigation & Routing](#navigation--routing)
7. [State Management](#state-management)
8. [Styling & Theming](#styling--theming)
9. [Data Flow & API](#data-flow--api)
10. [Testing & Debugging](#testing--debugging)
11. [Common Patterns & Examples](#common-patterns--examples)
12. [Troubleshooting](#troubleshooting)
13. [Quick Reference](#quick-reference)

---

## 🎯 **Project Overview**

**2Plates** is a React Native fitness tracking app built with Expo and TypeScript. The app allows users to log workouts, track exercises, view progress, and manage their fitness journey.

### **Tech Stack**
- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript (migrated from JavaScript)
- **Navigation**: React Navigation v7
- **State Management**: React Hooks (useState, useEffect, useCallback, useMemo)
- **Storage**: AsyncStorage for local data persistence
- **Animations**: React Native Reanimated v3
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: StyleSheet with centralized theme system

### **Key Features**
- Workout logging with drag-and-drop exercise reordering
- Exercise library with categories and difficulty levels
- Progress tracking with statistics and charts
- Calendar view for workout history
- Settings and preferences management

---

## 🏗️ **Codebase Architecture**

### **Architecture Pattern**
The app follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Screens       │    │   Components    │    │   Hooks         │
│   (UI Layer)    │◄───┤   (Reusable)    │◄───┤   (Logic)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Navigation    │    │   Constants     │    │   Utils         │
│   (Routing)     │    │   (Theme/Data)  │    │   (Helpers)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Data Flow**
1. **User Interaction** → Screen Component
2. **Screen Component** → Custom Hook
3. **Custom Hook** → AsyncStorage/API
4. **Data Update** → State Management
5. **State Change** → UI Re-render

---

## 📁 **Directory Structure**

```
2plates/
├── App.tsx                          # Main app entry point
├── expo-env.d.ts                    # Expo TypeScript declarations
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
├── metro.config.js                  # Metro bundler configuration
├── babel.config.js                  # Babel configuration
└── src/
    ├── components/                  # Reusable UI components
    │   ├── common/                  # Shared components
    │   │   ├── ActionCard.tsx       # Action button component
    │   │   ├── EmptyState.tsx       # Empty state display
    │   │   ├── ErrorBoundary.tsx    # Error handling wrapper
    │   │   ├── Header.tsx           # Page header component
    │   │   ├── PerformanceMonitor.tsx # Performance tracking
    │   │   ├── StatCard.tsx         # Statistics display card
    │   │   └── index.ts             # Common components export
    │   ├── ui/                      # Basic UI components
    │   │   ├── Button.tsx           # Custom button component
    │   │   ├── Modal.tsx            # Modal dialog component
    │   │   └── index.ts             # UI components export
    │   ├── workout/                 # Workout-specific components
    │   │   ├── AddSetModal.tsx      # Add workout set modal
    │   │   ├── Calendar.tsx         # Workout calendar view
    │   │   ├── DraggableExercise.tsx # Draggable exercise item
    │   │   ├── ExerciseCard.tsx     # Exercise display card
    │   │   ├── ExerciseSelectionModal.tsx # Exercise picker
    │   │   ├── WorkoutCard.tsx      # Workout summary card
    │   │   └── index.ts             # Workout components export
    │   └── index.ts                 # All components export
    ├── constants/                   # App constants and configuration
    │   ├── app.ts                   # App configuration
    │   ├── date.ts                  # Date-related constants
    │   ├── exercises.ts             # Exercise data and categories
    │   ├── theme.ts                 # Colors, spacing, typography
    │   └── index.ts                 # Constants export
    ├── hooks/                       # Custom React hooks
    │   ├── usePerformance.ts        # Performance monitoring hook
    │   ├── useWorkoutData.ts        # Workout data management
    │   ├── useWorkoutForm.ts        # Workout form state
    │   └── index.ts                 # Hooks export
    ├── navigation/                  # Navigation configuration
    │   └── AppNavigator.tsx         # Main navigation setup
    ├── screens/                     # Screen components
    │   ├── ExerciseLibraryScreen.tsx # Exercise library
    │   ├── HomeScreen.tsx           # Home dashboard
    │   ├── LogScreen.tsx            # Workout logging
    │   ├── ProgressScreen.tsx       # Progress tracking
    │   └── SettingsScreen.tsx       # App settings
    ├── types/                       # TypeScript type definitions
    │   └── index.ts                 # All type definitions
    ├── utils/                       # Utility functions
    │   ├── date.ts                  # Date manipulation utilities
    │   ├── error.ts                 # Error handling utilities
    │   ├── workout.ts               # Workout calculation utilities
    │   └── index.ts                 # Utils export
    └── index.ts                     # Main source export
```

---

## 🔧 **TypeScript Implementation Rules**

### **Configuration**
- **File**: `tsconfig.json`
- **Module Resolution**: `bundler` (required for Expo)
- **JSX**: `react-native`
- **Strict Mode**: `false` (to avoid React Native compatibility issues)

### **File Extensions**
- **Components**: `.tsx` (React components with JSX)
- **Hooks/Utils/Constants**: `.ts` (TypeScript without JSX)
- **Type Definitions**: `.ts` (interfaces and types)

### **Type Safety Rules**
1. **Always define interfaces** for component props
2. **Use proper typing** for state and functions
3. **Avoid `any` type** except for React Native compatibility
4. **Use type assertions** (`as any`) for complex React Native types
5. **Never use `defaultProps`** (causes TypeScript errors)

### **Common Type Patterns**
```typescript
// Component Props Interface
interface ComponentProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  children?: ReactNode;
}

// Hook Return Type
interface UseHookReturn {
  data: DataType[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// API Response Type
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

---

## 🧩 **Component Development Guidelines**

### **Component Structure**
```typescript
// 1. Imports (in order)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants';
import { ComponentProps } from '../../types';

// 2. Interface Definition
interface ComponentProps {
  // Define all props here
}

// 3. Component Implementation
const Component: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 = 'defaultValue' 
}) => {
  // Component logic here
  
  return (
    <View style={styles.container}>
      <Text>{prop1}</Text>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  container: {
    // styles here
  },
});

// 5. Export
export default Component;
```

### **Component Categories**

#### **Common Components** (`src/components/common/`)
- **Purpose**: Reusable across the entire app
- **Examples**: Button, Header, ErrorBoundary, StatCard
- **Naming**: Descriptive names (e.g., `ActionCard.tsx`)

#### **UI Components** (`src/components/ui/`)
- **Purpose**: Basic UI building blocks
- **Examples**: Button, Modal, Input
- **Naming**: Simple, generic names

#### **Workout Components** (`src/components/workout/`)
- **Purpose**: Workout-specific functionality
- **Examples**: DraggableExercise, WorkoutCard, Calendar
- **Naming**: Feature-specific names

### **Component Rules**
1. **One component per file**
2. **Use PascalCase for component names**
3. **Export as default**
4. **Define props interface**
5. **Use React.FC type annotation**
6. **Include proper TypeScript types**

---

## 🧭 **Navigation & Routing**

### **Navigation Structure**
```
AppNavigator (Bottom Tab Navigator)
├── Home Tab
│   └── HomeScreen
├── Log Tab
│   └── LogScreen
├── Progress Tab
│   └── ProgressScreen
├── Library Tab
│   └── ExerciseLibraryScreen
└── Settings Tab
    └── SettingsScreen
```

### **Navigation Implementation**
- **File**: `src/navigation/AppNavigator.tsx`
- **Type**: Bottom Tab Navigator
- **Icons**: Ionicons with focused/unfocused states
- **Styling**: Custom tab bar with theme colors

### **Screen Navigation**
```typescript
// Navigation Props Type
interface NavigationProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
    reset: (state: any) => void;
  };
}

// Usage in Screen Component
const Screen: React.FC<NavigationProps> = ({ navigation }) => {
  const handleNavigate = () => {
    navigation.navigate('TargetScreen', { param: 'value' });
  };
  
  return (
    // Screen content
  );
};
```

### **Navigation Rules**
1. **Use NavigationProps interface** for screen components
2. **Define screen names** as constants
3. **Pass parameters** through navigation state
4. **Handle back navigation** properly
5. **Use proper TypeScript typing**

---

## 🔄 **State Management**

### **State Management Pattern**
The app uses **React Hooks** for state management with a custom hook pattern:

#### **Global State Hooks**
- **`useWorkoutData`**: Manages workout logs and statistics
- **`useWorkoutForm`**: Manages current workout form state
- **`usePerformance`**: Tracks app performance metrics

#### **Local State Hooks**
- **`useState`**: Component-level state
- **`useEffect`**: Side effects and lifecycle
- **`useCallback`**: Memoized functions
- **`useMemo`**: Memoized values

### **Data Flow Pattern**
```
User Action → Component → Custom Hook → AsyncStorage → State Update → UI Re-render
```

### **State Management Rules**
1. **Use custom hooks** for complex state logic
2. **Keep state close** to where it's used
3. **Use useCallback** for event handlers
4. **Use useMemo** for expensive calculations
5. **Handle loading and error states**

### **Example State Hook**
```typescript
export const useWorkoutData = (): UseWorkoutDataReturn => {
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, Workout>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('workoutLogs');
      if (data) {
        setWorkoutLogs(JSON.parse(data));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    workoutLogs,
    loading,
    error,
    loadData,
    // ... other methods
  };
};
```

---

## 🎨 **Styling & Theming**

### **Theme System**
The app uses a centralized theme system located in `src/constants/theme.ts`:

#### **Color Palette**
```typescript
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
  // ... shadow colors
};
```

#### **Spacing System**
```typescript
export const SPACING: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};
```

#### **Typography**
```typescript
export const TYPOGRAPHY: Typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 28, fontWeight: '700' },
  h3: { fontSize: 24, fontWeight: '700' },
  h4: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  bodySmall: { fontSize: 14, fontWeight: '400' },
  // ... more typography styles
};
```

### **Styling Rules**
1. **Use theme constants** instead of hardcoded values
2. **Follow spacing system** for consistent layouts
3. **Use StyleSheet.create()** for performance
4. **Group related styles** together
5. **Use descriptive style names**

### **Style Patterns**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  header: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
});
```

---

## 📊 **Data Flow & API**

### **Data Storage**
- **Primary Storage**: AsyncStorage (local device storage)
- **Data Format**: JSON serialization
- **Storage Keys**: Defined in `src/constants/app.ts`

### **Data Models**
```typescript
// Workout Data Structure
interface Workout {
  id: ID;
  exercises: Exercise[];
  date: string;
  completedAt?: string;
  dateKey: string;
}

interface Exercise {
  id: ID;
  name: string;
  sets: WorkoutSet[];
}

interface WorkoutSet {
  id: ID;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}
```

### **Data Operations**
- **Create**: Add new workout/exercise
- **Read**: Load workout logs and statistics
- **Update**: Modify existing workouts
- **Delete**: Remove workouts/exercises

### **Error Handling**
- **Try-catch blocks** for all async operations
- **User-friendly error messages** via `getUserFriendlyErrorMessage`
- **Error logging** via `logError` utility
- **Retry mechanism** with exponential backoff

---

## 🧪 **Testing & Debugging**

### **TypeScript Compilation**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Start development server
npx expo start --clear
```

### **Common Debugging Tools**
1. **React Native Debugger**: For state inspection
2. **Expo DevTools**: For performance monitoring
3. **Console Logs**: For debugging information
4. **Error Boundaries**: For error catching

### **Performance Monitoring**
- **PerformanceMonitor component**: Tracks render times
- **usePerformance hook**: Measures function execution
- **Memory usage tracking**: Via performance utilities

### **Testing Checklist**
- [ ] TypeScript compilation passes
- [ ] No console errors
- [ ] Components render correctly
- [ ] Navigation works properly
- [ ] Data persistence functions
- [ ] Error handling works

---

## 📝 **Common Patterns & Examples**

### **Screen Component Pattern**
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useWorkoutData } from '../hooks';
import { Header, StatCard } from '../components';
import { COLORS, SPACING } from '../constants';
import { NavigationProps } from '../types';

const Screen: React.FC<NavigationProps> = ({ navigation }) => {
  const { workoutStats, loading, error } = useWorkoutData();
  const [localState, setLocalState] = useState<string>('');

  useEffect(() => {
    // Side effects here
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Screen Title" />
      <View style={styles.content}>
        {/* Screen content */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
  },
});

export default Screen;
```

### **Custom Hook Pattern**
```typescript
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HookReturnType } from '../types';

export const useCustomHook = (): HookReturnType => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const storedData = await AsyncStorage.getItem('key');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveData = useCallback(async (newData: DataType[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('key', JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    saveData,
  };
};
```

### **Modal Component Pattern**
```typescript
import React from 'react';
import { View, Text, StyleSheet, Modal as RNModal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { ModalProps } from '../../types';

const Modal: React.FC<ModalProps> = ({ 
  visible, 
  onClose, 
  title, 
  children 
}) => {
  return (
    <RNModal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          {title && (
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
          )}
          {children}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xl,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
  },
});

export default Modal;
```

---

## 🔧 **Troubleshooting**

### **Common TypeScript Errors**

#### **JSX Namespace Error**
```typescript
// ❌ WRONG
const Component = (): JSX.Element => { ... }

// ✅ CORRECT
const Component = () => { ... }
// or
const Component: React.FC<Props> = () => { ... }
```

#### **DefaultProps Error**
```typescript
// ❌ WRONG
Component.defaultProps = { prop: 'value' };

// ✅ CORRECT
const Component: React.FC<Props> = ({ prop = 'value' }) => { ... }
```

#### **Icon Name Error**
```typescript
// ❌ WRONG
<Ionicons name={iconName} size={24} color={color} />

// ✅ CORRECT
<Ionicons name={iconName as any} size={24} color={color} />
```

#### **Style Array Error**
```typescript
// ❌ WRONG
style={[style1, style2, conditionalStyle]}

// ✅ CORRECT
style={[style1, style2, conditionalStyle] as any}
```

### **Runtime Errors**

#### **Hermes Engine Error**
- **Cause**: TypeScript configuration issues
- **Solution**: Check `tsconfig.json` settings, use `as any` for complex types

#### **Navigation Error**
- **Cause**: Missing navigation props or incorrect screen names
- **Solution**: Use `NavigationProps` interface, check screen name constants

#### **AsyncStorage Error**
- **Cause**: JSON parsing errors or storage permission issues
- **Solution**: Add try-catch blocks, validate data before parsing

### **Performance Issues**

#### **Slow Renders**
- **Solution**: Use `React.memo`, `useCallback`, `useMemo`
- **Check**: PerformanceMonitor component for render times

#### **Memory Leaks**
- **Solution**: Clean up subscriptions in `useEffect` cleanup
- **Check**: Remove event listeners and timers

---

## 🚀 **Quick Reference**

### **File Creation Checklist**
- [ ] Choose correct file extension (`.tsx` for components, `.ts` for others)
- [ ] Create proper TypeScript interface
- [ ] Use React.FC type annotation
- [ ] Import required dependencies
- [ ] Follow naming conventions
- [ ] Add proper exports
- [ ] Test TypeScript compilation

### **Component Development Checklist**
- [ ] Define props interface
- [ ] Use proper TypeScript types
- [ ] Handle optional props correctly
- [ ] Use theme constants for styling
- [ ] Add proper accessibility props
- [ ] Test component rendering
- [ ] Check for TypeScript errors

### **Hook Development Checklist**
- [ ] Define return type interface
- [ ] Use proper state typing
- [ ] Handle async operations correctly
- [ ] Add error handling
- [ ] Use useCallback for functions
- [ ] Use useMemo for expensive calculations
- [ ] Test hook functionality

### **Common Commands**
```bash
# Start development server
npx expo start --clear

# Check TypeScript errors
npx tsc --noEmit

# Install dependencies
npm install --legacy-peer-deps

# Clear Metro cache
npx expo start --clear
```

### **Important Files to Remember**
- **`src/types/index.ts`**: All TypeScript type definitions
- **`src/constants/theme.ts`**: Colors, spacing, typography
- **`src/hooks/useWorkoutData.ts`**: Main data management hook
- **`src/navigation/AppNavigator.tsx`**: Navigation configuration
- **`tsconfig.json`**: TypeScript configuration

### **Code Quality Standards**
- **TypeScript**: Strict typing with proper interfaces
- **Performance**: Memoization and optimization
- **Accessibility**: Proper labels and roles
- **Error Handling**: Comprehensive error management
- **Code Style**: Consistent formatting and naming
- **Documentation**: Clear comments and examples

---

## 📞 **Getting Help**

### **When Stuck**
1. **Check this guide** for common patterns
2. **Look at similar files** in the codebase
3. **Check TypeScript errors** with `npx tsc --noEmit`
4. **Review existing implementations** for reference
5. **Test with simple examples** first

### **Common Resources**
- **React Native Docs**: https://reactnative.dev/
- **Expo Docs**: https://docs.expo.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **React Navigation**: https://reactnavigation.org/

---

**Remember**: This codebase follows TypeScript best practices with React Native compatibility. When in doubt, check existing implementations and follow the established patterns! 🎯
