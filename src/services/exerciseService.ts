import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExerciseAPIResponse, ExerciseInfo, ExerciseCategory } from '../types';
import { logError } from '../utils/error';

const EXERCISE_API_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const EXERCISE_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const CACHE_KEY = '@2plates_exercise_cache';
const CACHE_TIMESTAMP_KEY = '@2plates_exercise_cache_timestamp';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Maps primary muscle to exercise category
 */
const mapMuscleToCategory = (primaryMuscles: string[]): ExerciseCategory => {
  if (!primaryMuscles || primaryMuscles.length === 0) return 'Core';
  
  const muscle = primaryMuscles[0].toLowerCase();
  
  // Chest
  if (muscle.includes('chest') || muscle.includes('pectorals')) return 'Chest';
  
  // Back
  if (muscle.includes('lats') || muscle.includes('traps') || 
      muscle.includes('rhomboids') || muscle.includes('lower back') ||
      muscle.includes('middle back')) return 'Back';
  
  // Legs
  if (muscle.includes('quadriceps') || muscle.includes('hamstrings') || 
      muscle.includes('calves') || muscle.includes('glutes') ||
      muscle.includes('adductors') || muscle.includes('abductors')) return 'Legs';
  
  // Shoulders
  if (muscle.includes('shoulders') || muscle.includes('deltoids')) return 'Shoulders';
  
  // Arms
  if (muscle.includes('biceps') || muscle.includes('triceps') || 
      muscle.includes('forearms')) return 'Arms';
  
  // Core
  if (muscle.includes('abdominals') || muscle.includes('abs') || 
      muscle.includes('obliques') || muscle.includes('core')) return 'Core';
  
  // Cardio
  if (muscle.includes('cardio') || muscle.includes('cardiovascular')) return 'Cardio';
  
  // Default to Core for unmapped muscles
  return 'Core';
};

/**
 * Maps exercise level to difficulty level
 */
const mapLevelToDifficulty = (level: string | null): 'Beginner' | 'Intermediate' | 'Advanced' => {
  if (!level) return 'Beginner';
  
  switch (level.toLowerCase()) {
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
 * Transforms API response to ExerciseInfo format
 */
const transformExercise = (apiExercise: ExerciseAPIResponse): ExerciseInfo => {
  const category = mapMuscleToCategory(apiExercise.primaryMuscles);
  const difficulty = mapLevelToDifficulty(apiExercise.level);
  
  // Generate description from instructions
  const description = apiExercise.instructions && apiExercise.instructions.length > 0
    ? apiExercise.instructions[0]
    : `${apiExercise.name} - ${apiExercise.primaryMuscles.join(', ')}`;
  
  // Transform relative image paths to absolute URLs
  const images = apiExercise.images?.map(img => `${EXERCISE_IMAGE_BASE_URL}${img}`) || [];
  
  return {
    id: apiExercise.id,
    name: apiExercise.name,
    category,
    force: apiExercise.force,
    level: apiExercise.level,
    mechanic: apiExercise.mechanic,
    equipment: apiExercise.equipment,
    primaryMuscles: apiExercise.primaryMuscles,
    secondaryMuscles: apiExercise.secondaryMuscles,
    instructions: apiExercise.instructions,
    images,
    // Legacy fields for backward compatibility
    difficulty,
    muscle: apiExercise.primaryMuscles[0] || 'Unknown',
    description,
  };
};

/**
 * Checks if cache is still valid
 */
const isCacheValid = async (): Promise<boolean> => {
  try {
    const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheAge = Date.now() - parseInt(timestamp, 10);
    return cacheAge < CACHE_DURATION;
  } catch (error) {
    logError(error as Error, 'isCacheValid');
    return false;
  }
};

/**
 * Fetches exercises from cache
 */
export const fetchExercisesFromCache = async (): Promise<ExerciseInfo[] | null> => {
  try {
    const isValid = await isCacheValid();
    if (!isValid) return null;
    
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;
    
    return JSON.parse(cachedData) as ExerciseInfo[];
  } catch (error) {
    logError(error as Error, 'fetchExercisesFromCache');
    return null;
  }
};

/**
 * Saves exercises to cache
 */
export const saveExercisesToCache = async (exercises: ExerciseInfo[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(exercises));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    logError(error as Error, 'saveExercisesToCache');
  }
};

/**
 * Fetches exercises from the API
 */
export const fetchExercisesFromAPI = async (): Promise<ExerciseInfo[]> => {
  try {
    const response = await fetch(EXERCISE_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ExerciseAPIResponse[] = await response.json();
    
    // Transform and filter exercises
    const exercises = data
      .map(transformExercise)
      .filter(exercise => {
        // Filter out exercises with missing critical data
        return exercise.name && exercise.primaryMuscles && exercise.primaryMuscles.length > 0;
      });
    
    return exercises;
  } catch (error) {
    logError(error as Error, 'fetchExercisesFromAPI');
    throw error;
  }
};

/**
 * Main function to get exercises (tries cache first, then API)
 */
export const getExercises = async (forceRefresh: boolean = false): Promise<ExerciseInfo[]> => {
  try {
    // Try cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedExercises = await fetchExercisesFromCache();
      if (cachedExercises && cachedExercises.length > 0) {
        console.log(`Loaded ${cachedExercises.length} exercises from cache`);
        return cachedExercises;
      }
    }
    
    // Fetch from API
    console.log('Fetching exercises from API...');
    const exercises = await fetchExercisesFromAPI();
    
    // Save to cache
    await saveExercisesToCache(exercises);
    
    console.log(`Fetched and cached ${exercises.length} exercises`);
    return exercises;
  } catch (error) {
    logError(error as Error, 'getExercises');
    
    // Try to return cached data as fallback
    const cachedExercises = await fetchExercisesFromCache();
    if (cachedExercises && cachedExercises.length > 0) {
      console.log('Using cached exercises as fallback');
      return cachedExercises;
    }
    
    throw error;
  }
};

/**
 * Clears the exercise cache
 */
export const clearExerciseCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY);
    console.log('Exercise cache cleared');
  } catch (error) {
    logError(error as Error, 'clearExerciseCache');
  }
};

/**
 * Gets cache statistics
 */
export const getCacheStats = async (): Promise<{
  isCached: boolean;
  cacheAge: number | null;
  exerciseCount: number;
}> => {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    const isCached = !!cachedData;
    const cacheAge = timestamp ? Date.now() - parseInt(timestamp, 10) : null;
    const exerciseCount = cachedData ? JSON.parse(cachedData).length : 0;
    
    return { isCached, cacheAge, exerciseCount };
  } catch (error) {
    logError(error as Error, 'getCacheStats');
    return { isCached: false, cacheAge: null, exerciseCount: 0 };
  }
};

