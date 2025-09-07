import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateWorkoutStats } from '../utils/workout';
import { logError, getUserFriendlyErrorMessage } from '../utils/error';
import { APP_CONFIG } from '../constants';
import { Workout, UseWorkoutDataReturn } from '../types';

export const useWorkoutData = (): UseWorkoutDataReturn => {
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, Workout>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await AsyncStorage.getItem(APP_CONFIG.storageKeys.workoutLogs);
      if (data) {
        setWorkoutLogs(JSON.parse(data) as Record<string, Workout>);
      }
    } catch (err) {
      const friendlyError = getUserFriendlyErrorMessage(err as Error, 'Failed to load workout data');
      setError(new Error(friendlyError));
      logError(err as Error, 'useWorkoutData.loadData');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWorkoutLogs = useCallback(async (logs: Record<string, Workout>): Promise<void> => {
    try {
      setError(null);
      await AsyncStorage.setItem(APP_CONFIG.storageKeys.workoutLogs, JSON.stringify(logs));
      setWorkoutLogs(logs);
    } catch (err) {
      const friendlyError = getUserFriendlyErrorMessage(err as Error, 'Failed to save workout data');
      setError(new Error(friendlyError));
      logError(err as Error, 'useWorkoutData.saveWorkoutLogs');
      throw new Error(friendlyError); // Re-throw to allow calling code to handle
    }
  }, []);

  const addWorkout = useCallback(async (workout: Workout): Promise<void> => {
    const updated = { ...workoutLogs, [workout.dateKey]: workout };
    await saveWorkoutLogs(updated);
  }, [workoutLogs, saveWorkoutLogs]);

  const deleteWorkout = useCallback(async (dateKey: string): Promise<void> => {
    const updated = { ...workoutLogs };
    delete updated[dateKey];
    await saveWorkoutLogs(updated);
  }, [workoutLogs, saveWorkoutLogs]);

  const getWorkoutStats = useCallback(() => {
    return calculateWorkoutStats(workoutLogs);
  }, [workoutLogs]);

  const getRecentWorkouts = useCallback((limit: number = 5): Workout[] => {
    return Object.values(workoutLogs)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [workoutLogs]);

  // Memoize expensive calculations
  const workoutStats = useMemo(() => getWorkoutStats(), [getWorkoutStats]);
  const recentWorkouts = useMemo(() => getRecentWorkouts(), [getRecentWorkouts]);

  return {
    workoutLogs,
    loading,
    error,
    loadData,
    saveWorkoutLogs,
    addWorkout,
    deleteWorkout,
    getWorkoutStats,
    getRecentWorkouts,
    workoutStats,
    recentWorkouts,
  };
};
