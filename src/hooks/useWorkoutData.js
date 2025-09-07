import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateWorkoutStats } from '../utils/workout';
import { logError, getUserFriendlyErrorMessage } from '../utils/error';
import { APP_CONFIG } from '../constants';

export const useWorkoutData = () => {
  const [workoutLogs, setWorkoutLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AsyncStorage.getItem(APP_CONFIG.storageKeys.workoutLogs);
      if (data) {
        setWorkoutLogs(JSON.parse(data));
      }
    } catch (err) {
      const friendlyError = getUserFriendlyErrorMessage(err, 'Failed to load workout data');
      setError(new Error(friendlyError));
      logError(err, 'useWorkoutData.loadData');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWorkoutLogs = useCallback(async (logs) => {
    try {
      setError(null);
      await AsyncStorage.setItem(APP_CONFIG.storageKeys.workoutLogs, JSON.stringify(logs));
      setWorkoutLogs(logs);
    } catch (err) {
      const friendlyError = getUserFriendlyErrorMessage(err, 'Failed to save workout data');
      setError(new Error(friendlyError));
      logError(err, 'useWorkoutData.saveWorkoutLogs');
      throw new Error(friendlyError); // Re-throw to allow calling code to handle
    }
  }, []);

  const addWorkout = useCallback(async (workout) => {
    const updated = { ...workoutLogs, [workout.dateKey]: workout };
    await saveWorkoutLogs(updated);
  }, [workoutLogs, saveWorkoutLogs]);

  const deleteWorkout = useCallback(async (dateKey) => {
    const updated = { ...workoutLogs };
    delete updated[dateKey];
    await saveWorkoutLogs(updated);
  }, [workoutLogs, saveWorkoutLogs]);

  const getWorkoutStats = useCallback(() => {
    return calculateWorkoutStats(workoutLogs);
  }, [workoutLogs]);

  const getRecentWorkouts = useCallback((limit = 5) => {
    return Object.values(workoutLogs)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
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
