import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useWorkoutCreation, useWorkoutData } from '../hooks';
import { Header, DraggableExerciseItem, ExerciseSelectionModal, EmptyState } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';
import { Exercise } from '../types';

const LogScreen: React.FC = () => {
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  
  const {
    exercises,
    addExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    reorderExercises,
    setExercisesOrder,
    clearWorkout,
    getWorkoutData,
  } = useWorkoutCreation();

  const { addWorkout } = useWorkoutData();

  const handleAddExercise = (exerciseName: string) => {
    addExercise(exerciseName);
  };

  const handleAddSet = (exerciseId: string | number) => {
    addSet(exerciseId, { reps: 0, weight: 0 });
  };

  const handleRemoveSet = (exerciseId: string | number, setId: string | number) => {
    removeSet(exerciseId, setId);
  };

  const handleUpdateSet = (exerciseId: string | number, setId: string | number, field: keyof any, value: any) => {
    updateSet(exerciseId, setId, { [field]: value });
  };

  const handleSaveWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert('No Exercises', 'Add at least one exercise to save your workout.');
      return;
    }

    const exercisesWithSets = exercises.filter(ex => ex.sets.length > 0);
    if (exercisesWithSets.length === 0) {
      Alert.alert('No Sets', 'Add at least one set to an exercise to save your workout.');
      return;
    }

    try {
      const workoutData = getWorkoutData();
      const workout = {
        id: Date.now(),
        exercises: workoutData.exercises,
        date: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        dateKey: new Date().toISOString().split('T')[0],
      };

      await addWorkout(workout);
      clearWorkout();
      Alert.alert('Success', 'Workout saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  const handleClearWorkout = () => {
    Alert.alert(
      'Clear Workout',
      'Are you sure you want to clear all exercises? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearWorkout,
        },
      ]
    );
  };

  const renderExerciseItem = ({ item, drag, isActive }: RenderItemParams<Exercise>) => (
    <DraggableExerciseItem
      exercise={item}
      onRemove={removeExercise}
      onAddSet={handleAddSet}
      onRemoveSet={handleRemoveSet}
      onUpdateSet={handleUpdateSet}
      drag={drag}
      isActive={isActive}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title="Create Workout"
        subtitle="Add exercises and sets"
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowExerciseSelection(true)}
        >
          <Ionicons name="add" size={18} color={COLORS.surface} />
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>

        {exercises.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveWorkout}
            >
              <Ionicons name="checkmark" size={18} color={COLORS.surface} />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearWorkout}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.surface} />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Exercise List */}
      <View style={styles.exerciseListContainer}>
        {exercises.length > 0 ? (
          <DraggableFlatList
            data={exercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id.toString()}
            onDragEnd={({ data }) => {
              // Update the exercises array with the new order
              setExercisesOrder(data);
            }}
            contentContainerStyle={styles.draggableList}
          />
        ) : (
          <EmptyState
            icon="fitness-outline"
            title="No exercises yet"
            subtitle="Add your first exercise to start creating your workout"
          />
        )}
      </View>

      {/* Exercise Selection Modal */}
      <ExerciseSelectionModal
        visible={showExerciseSelection}
        onClose={() => setShowExerciseSelection(false)}
        onSelectExercise={handleAddExercise}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    flex: 1,
    justifyContent: 'center',
  },
  addButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    minWidth: 80,
  },
  saveButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text.disabled,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    minWidth: 80,
  },
  clearButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  exerciseListContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  draggableList: {
    paddingBottom: SPACING.xl,
  },
});

export default LogScreen;