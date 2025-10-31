import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExerciseInfo, ExerciseCategory, UseExerciseDataReturn } from '../types';
import { getExercises } from '../services/exerciseService';
import { POPULAR_EXERCISES } from '../constants/exercises';
import { logError } from '../utils/error';

const FAVORITES_KEY = '@2plates_favorite_exercises';
const RECENT_KEY = '@2plates_recent_exercises';
const MAX_RECENT = 10;

/**
 * Custom hook for managing exercise data
 * Fetches exercises from API/cache and provides filtering utilities
 * Includes favorites, recents, and popular exercises for better UX
 */
export const useExerciseData = (): UseExerciseDataReturn => {
  const [exercises, setExercises] = useState<ExerciseInfo[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Loads exercises from cache or API
   */
  const loadExercises = useCallback(async (forceRefresh: boolean = false): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedExercises = await getExercises(forceRefresh);
      setExercises(fetchedExercises);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj);
      logError(errorObj, 'loadExercises');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refreshes exercises from API
   */
  const refreshExercises = useCallback(async (): Promise<void> => {
    await loadExercises(true);
  }, [loadExercises]);

  /**
   * Filters exercises by category
   */
  const getExercisesByCategory = useCallback((category: ExerciseCategory): ExerciseInfo[] => {
    if (category === 'All') return exercises;
    return exercises.filter(exercise => exercise.category === category);
  }, [exercises]);

  /**
   * Filters exercises by muscle group
   */
  const getExercisesByMuscle = useCallback((muscle: string): ExerciseInfo[] => {
    const normalizedMuscle = muscle.toLowerCase();
    return exercises.filter(exercise => {
      const primaryMatch = exercise.primaryMuscles?.some(m => 
        m.toLowerCase().includes(normalizedMuscle)
      );
      const secondaryMatch = exercise.secondaryMuscles?.some(m => 
        m.toLowerCase().includes(normalizedMuscle)
      );
      return primaryMatch || secondaryMatch;
    });
  }, [exercises]);

  /**
   * Filters exercises by equipment
   */
  const getExercisesByEquipment = useCallback((equipment: string): ExerciseInfo[] => {
    const normalizedEquipment = equipment.toLowerCase();
    return exercises.filter(exercise => {
      if (!exercise.equipment) return normalizedEquipment === 'none' || normalizedEquipment === 'bodyweight';
      return exercise.equipment.toLowerCase().includes(normalizedEquipment);
    });
  }, [exercises]);

  /**
   * Searches exercises by name, description, or instructions
   */
  const searchExercises = useCallback((query: string): ExerciseInfo[] => {
    if (!query || query.trim() === '') return exercises;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return exercises.filter(exercise => {
      // Search in name
      const nameMatch = exercise.name.toLowerCase().includes(normalizedQuery);
      
      // Search in description
      const descriptionMatch = exercise.description?.toLowerCase().includes(normalizedQuery);
      
      // Search in instructions
      const instructionsMatch = exercise.instructions?.some(instruction =>
        instruction.toLowerCase().includes(normalizedQuery)
      );
      
      // Search in muscles
      const muscleMatch = [
        ...(exercise.primaryMuscles || []),
        ...(exercise.secondaryMuscles || [])
      ].some(muscle => muscle.toLowerCase().includes(normalizedQuery));
      
      // Search in equipment
      const equipmentMatch = exercise.equipment?.toLowerCase().includes(normalizedQuery);
      
      return nameMatch || descriptionMatch || instructionsMatch || muscleMatch || equipmentMatch;
    });
  }, [exercises]);

  /**
   * Load favorites from storage
   */
  const loadFavorites = useCallback(async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (error) {
      logError(error as Error, 'loadFavorites');
    }
  }, []);

  /**
   * Load recent exercises from storage
   */
  const loadRecent = useCallback(async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      if (stored) {
        setRecentIds(JSON.parse(stored));
      }
    } catch (error) {
      logError(error as Error, 'loadRecent');
    }
  }, []);

  /**
   * Toggle favorite status for an exercise
   */
  const toggleFavorite = useCallback(async (exerciseId: string): Promise<void> => {
    try {
      const newFavorites = favoriteIds.includes(exerciseId)
        ? favoriteIds.filter(id => id !== exerciseId)
        : [...favoriteIds, exerciseId];
      
      setFavoriteIds(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      logError(error as Error, 'toggleFavorite');
    }
  }, [favoriteIds]);

  /**
   * Check if exercise is favorited
   */
  const isFavorite = useCallback((exerciseId: string): boolean => {
    return favoriteIds.includes(exerciseId);
  }, [favoriteIds]);

  /**
   * Add exercise to recent list
   */
  const addToRecent = useCallback(async (exerciseId: string): Promise<void> => {
    try {
      // Remove if already exists, then add to front
      const filtered = recentIds.filter(id => id !== exerciseId);
      const newRecent = [exerciseId, ...filtered].slice(0, MAX_RECENT);
      
      setRecentIds(newRecent);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
    } catch (error) {
      logError(error as Error, 'addToRecent');
    }
  }, [recentIds]);

  /**
   * Get popular exercises (curated list that matches names in database)
   */
  const popularExercises = useMemo(() => {
    return exercises.filter(exercise => 
      POPULAR_EXERCISES.some(popular => 
        exercise.name.toLowerCase().includes(popular.toLowerCase()) ||
        popular.toLowerCase().includes(exercise.name.toLowerCase())
      )
    ).slice(0, 30); // Limit to 30 most relevant
  }, [exercises]);

  /**
   * Get favorite exercises
   */
  const favoriteExercises = useMemo(() => {
    return exercises.filter(exercise => favoriteIds.includes(exercise.id));
  }, [exercises, favoriteIds]);

  /**
   * Get recent exercises
   */
  const recentExercises = useMemo(() => {
    return recentIds
      .map(id => exercises.find(ex => ex.id === id))
      .filter((ex): ex is ExerciseInfo => ex !== undefined);
  }, [exercises, recentIds]);

  // Load exercises, favorites, and recents on mount
  useEffect(() => {
    loadExercises();
    loadFavorites();
    loadRecent();
  }, [loadExercises, loadFavorites, loadRecent]);

  return {
    exercises,
    popularExercises,
    favoriteExercises,
    recentExercises,
    loading,
    error,
    refreshExercises,
    getExercisesByCategory,
    getExercisesByMuscle,
    getExercisesByEquipment,
    searchExercises,
    toggleFavorite,
    isFavorite,
    addToRecent,
  };
};

