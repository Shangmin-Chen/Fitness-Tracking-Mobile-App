/**
 * Type definitions and PropTypes for the application
 * This file provides centralized type definitions for better maintainability
 */

import PropTypes from 'prop-types';

// Common PropTypes
export const CommonPropTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  children: PropTypes.node,
  testID: PropTypes.string,
  accessibilityLabel: PropTypes.string,
};

// Button PropTypes
export const ButtonPropTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: CommonPropTypes.style,
  textStyle: CommonPropTypes.style,
  accessibilityLabel: CommonPropTypes.accessibilityLabel,
  testID: CommonPropTypes.testID,
};

// Header PropTypes
export const HeaderPropTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  pattern: PropTypes.node,
  style: CommonPropTypes.style,
};

// Workout related types
export const WorkoutPropTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  exercises: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    sets: PropTypes.arrayOf(PropTypes.shape({
      reps: PropTypes.number,
      weight: PropTypes.number,
      duration: PropTypes.number,
      distance: PropTypes.number,
    })).isRequired,
  })).isRequired,
  date: PropTypes.string.isRequired,
  completedAt: PropTypes.string,
  dateKey: PropTypes.string,
};

// Exercise PropTypes
export const ExercisePropTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  sets: PropTypes.arrayOf(PropTypes.shape({
    reps: PropTypes.number,
    weight: PropTypes.number,
    duration: PropTypes.number,
    distance: PropTypes.number,
  })).isRequired,
};

// Set PropTypes
export const SetPropTypes = {
  reps: PropTypes.number,
  weight: PropTypes.number,
  duration: PropTypes.number,
  distance: PropTypes.number,
};

// Navigation PropTypes
export const NavigationPropTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func,
    reset: PropTypes.func,
  }).isRequired,
};

// Hook return types (for documentation)
export const UseWorkoutDataReturnType = {
  workoutLogs: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  loadData: PropTypes.func.isRequired,
  saveWorkoutLogs: PropTypes.func.isRequired,
  addWorkout: PropTypes.func.isRequired,
  deleteWorkout: PropTypes.func.isRequired,
  getWorkoutStats: PropTypes.func.isRequired,
  getRecentWorkouts: PropTypes.func.isRequired,
  workoutStats: PropTypes.object,
  recentWorkouts: PropTypes.array,
};

// Default props helpers
export const DefaultProps = {
  button: {
    variant: 'primary',
    size: 'medium',
    icon: null,
    loading: false,
    disabled: false,
    style: null,
    textStyle: null,
    accessibilityLabel: null,
    testID: null,
  },
  header: {
    subtitle: null,
    pattern: null,
    style: null,
  },
};
