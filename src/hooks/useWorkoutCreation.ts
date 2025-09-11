import { useState, useCallback } from 'react';
import { Exercise, WorkoutSet } from '../types';

interface UseWorkoutCreationReturn {
  exercises: Exercise[];
  addExercise: (name: string) => void;
  removeExercise: (id: string | number) => void;
  updateExercise: (id: string | number, updates: Partial<Exercise>) => void;
  addSet: (exerciseId: string | number, set: Omit<WorkoutSet, 'id'>) => void;
  removeSet: (exerciseId: string | number, setId: string | number) => void;
  updateSet: (exerciseId: string | number, setId: string | number, updates: Partial<WorkoutSet>) => void;
  reorderExercises: (fromIndex: number, toIndex: number) => void;
  setExercisesOrder: (exercises: Exercise[]) => void;
  clearWorkout: () => void;
  getWorkoutData: () => { exercises: Exercise[] };
}

export const useWorkoutCreation = (): UseWorkoutCreationReturn => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = useCallback((name: string): void => {
    const newExercise: Exercise = {
      id: Date.now() + Math.random(),
      name,
      sets: []
    };
    setExercises(prev => [...prev, newExercise]);
  }, []);

  const removeExercise = useCallback((id: string | number): void => {
    setExercises(prev => prev.filter(exercise => exercise.id !== id));
  }, []);

  const updateExercise = useCallback((id: string | number, updates: Partial<Exercise>): void => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === id ? { ...exercise, ...updates } : exercise
    ));
  }, []);

  const addSet = useCallback((exerciseId: string | number, set: Omit<WorkoutSet, 'id'>): void => {
    const newSet: WorkoutSet = {
      id: Date.now() + Math.random(),
      ...set
    };
    setExercises(prev => prev.map(exercise =>
      exercise.id === exerciseId 
        ? { ...exercise, sets: [...exercise.sets, newSet] }
        : exercise
    ));
  }, []);

  const removeSet = useCallback((exerciseId: string | number, setId: string | number): void => {
    setExercises(prev => prev.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, sets: exercise.sets.filter(set => set.id !== setId) }
        : exercise
    ));
  }, []);

  const updateSet = useCallback((exerciseId: string | number, setId: string | number, updates: Partial<WorkoutSet>): void => {
    setExercises(prev => prev.map(exercise =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map(set =>
              set.id === setId ? { ...set, ...updates } : set
            )
          }
        : exercise
    ));
  }, []);

  const reorderExercises = useCallback((fromIndex: number, toIndex: number): void => {
    setExercises(prev => {
      const newExercises = [...prev];
      const [movedExercise] = newExercises.splice(fromIndex, 1);
      newExercises.splice(toIndex, 0, movedExercise);
      return newExercises;
    });
  }, []);

  const setExercisesOrder = useCallback((newExercises: Exercise[]): void => {
    setExercises(newExercises);
  }, []);

  const clearWorkout = useCallback((): void => {
    setExercises([]);
  }, []);

  const getWorkoutData = useCallback(() => {
    return { exercises };
  }, [exercises]);

  return {
    exercises,
    addExercise,
    removeExercise,
    updateExercise,
    addSet,
    removeSet,
    updateSet,
    reorderExercises,
    setExercisesOrder,
    clearWorkout,
    getWorkoutData,
  };
};
