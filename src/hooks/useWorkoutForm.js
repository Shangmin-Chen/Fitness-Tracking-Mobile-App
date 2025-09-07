import { useState } from 'react';

export const useWorkoutForm = () => {
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [newSet, setNewSet] = useState({ reps: '', weight: '' });

  const startNewWorkout = () => {
    setCurrentWorkout([]);
    setIsCreatingWorkout(true);
  };

  const addExercise = (name) => {
    setCurrentWorkout(prev => [...prev, {
      id: Date.now() + Math.random(),
      name,
      sets: []
    }]);
  };

  const removeExercise = (id) => {
    setCurrentWorkout(prev => prev.filter(ex => ex.id !== id));
  };

  const addSet = (exerciseId) => {
    setSelectedExerciseId(exerciseId);
    setNewSet({ reps: '', weight: '' });
    setShowAddSetModal(true);
  };

  const confirmAddSet = () => {
    const reps = parseInt(newSet.reps, 10);
    if (!reps || reps <= 0) {
      return false;
    }

    setCurrentWorkout(prev =>
      prev.map(ex =>
        ex.id === selectedExerciseId
          ? {
              ...ex,
              sets: [...ex.sets, {
                id: Date.now() + Math.random(),
                reps,
                weight: newSet.weight.trim() || 'Body Weight'
              }]
            }
          : ex
      )
    );

    setShowAddSetModal(false);
    return true;
  };

  const removeSet = (exerciseId, setId) => {
    setCurrentWorkout(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
          : ex
      )
    );
  };

  const updateSet = (exerciseId, setId, field, value) => {
    setCurrentWorkout(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(s =>
                s.id === setId ? { ...s, [field]: value } : s
              )
            }
          : ex
      )
    );
  };

  const moveExercise = (fromIndex, toIndex) => {
    setCurrentWorkout(prev => {
      const newWorkout = [...prev];
      const [moved] = newWorkout.splice(fromIndex, 1);
      newWorkout.splice(toIndex, 0, moved);
      return newWorkout;
    });
  };

  const resetForm = () => {
    setCurrentWorkout([]);
    setIsCreatingWorkout(false);
    setShowAddSetModal(false);
    setSelectedExerciseId(null);
    setNewSet({ reps: '', weight: '' });
  };

  return {
    currentWorkout,
    isCreatingWorkout,
    showAddSetModal,
    selectedExerciseId,
    newSet,
    setNewSet,
    setShowAddSetModal,
    startNewWorkout,
    addExercise,
    removeExercise,
    addSet,
    confirmAddSet,
    removeSet,
    updateSet,
    moveExercise,
    resetForm,
  };
};
