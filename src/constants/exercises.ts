import { ExerciseCategory, ExerciseInfo, ExerciseLevel, DifficultyLevel } from '../types';

/**
 * Popular exercises that most gym-goers actually use
 * These are prioritized in the UI for better UX
 */
export const POPULAR_EXERCISES: string[] = [
  // Compound Lifts (Big 3 + variations)
  'Barbell Bench Press',
  'Barbell Squat',
  'Barbell Deadlift',
  'Overhead Press',
  'Barbell Row',
  
  // Upper Body Push
  'Incline Dumbbell Press',
  'Dumbbell Bench Press',
  'Push-ups',
  'Dips',
  
  // Upper Body Pull
  'Pull-ups',
  'Lat Pulldown',
  'Dumbbell Row',
  'Cable Row',
  
  // Legs
  'Leg Press',
  'Romanian Deadlift',
  'Lunges',
  'Leg Curl',
  'Leg Extension',
  'Calf Raise',
  
  // Shoulders
  'Lateral Raise',
  'Front Raise',
  'Rear Delt Fly',
  'Face Pull',
  
  // Arms
  'Barbell Curl',
  'Dumbbell Curl',
  'Hammer Curl',
  'Tricep Pushdown',
  'Overhead Tricep Extension',
  
  // Core
  'Plank',
  'Crunches',
  'Russian Twist',
  'Hanging Leg Raise',
];

// Legacy - kept for backward compatibility
export const DEFAULT_EXERCISES: string[] = POPULAR_EXERCISES;

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  'All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'
];

/**
 * Legacy exercises (kept for backward compatibility)
 * NOTE: This is now replaced by the Free Exercise DB API
 * Use useExerciseData hook to fetch exercises from the API
 */
export const EXERCISES: ExerciseInfo[] = [
  // This array is kept for fallback purposes but should be replaced by API data
];

/**
 * Exercise equipment types from Free Exercise DB
 */
export const EQUIPMENT_TYPES = [
  'barbell',
  'dumbbell',
  'body weight',
  'cable',
  'machine',
  'kettlebells',
  'bands',
  'medicine ball',
  'exercise ball',
  'foam roll',
  'e-z curl bar',
  'none',
];

/**
 * All muscle groups from Free Exercise DB
 */
export const MUSCLE_GROUPS = [
  'abdominals',
  'abductors',
  'adductors',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'lower back',
  'middle back',
  'neck',
  'quadriceps',
  'shoulders',
  'traps',
  'triceps',
];

/**
 * Mapping utilities
 */

/**
 * Maps exercise level to difficulty
 */
export const mapLevelToDifficulty = (level: ExerciseLevel): DifficultyLevel => {
  if (!level) return 'Beginner';
  
  switch (level) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'expert':
      return 'Advanced';
    default:
      return 'Beginner';
  }
};

/**
 * Maps difficulty to exercise level
 */
export const mapDifficultyToLevel = (difficulty: DifficultyLevel): ExerciseLevel => {
  switch (difficulty) {
    case 'Beginner':
      return 'beginner';
    case 'Intermediate':
      return 'intermediate';
    case 'Advanced':
      return 'expert';
    default:
      return 'beginner';
  }
};

/**
 * Gets a friendly display name for equipment
 */
export const getEquipmentDisplayName = (equipment: string | null): string => {
  if (!equipment || equipment === 'none') return 'Bodyweight';
  
  // Capitalize first letter of each word
  return equipment
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Gets a friendly display name for muscle
 */
export const getMuscleDisplayName = (muscle: string): string => {
  // Capitalize first letter of each word
  return muscle
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats instructions array into readable text
 */
export const formatInstructions = (instructions: string[]): string => {
  if (!instructions || instructions.length === 0) {
    return 'No instructions available.';
  }
  
  return instructions
    .map((instruction, index) => `${index + 1}. ${instruction}`)
    .join('\n\n');
};
