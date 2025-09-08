import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useWorkoutData, useWorkoutForm } from '../hooks';
import { 
  Header, 
  WorkoutCard, 
  Calendar, 
  DraggableExercise, 
  AddSetModal, 
  ExerciseSelectionModal,
  ErrorBoundary 
} from '../components';
import { MONTHS, DAYS, COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';
import { getDateKey } from '../utils';

const LogScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draggedIndex, setDraggedIndex] = useState(-1);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  
  const { workoutLogs, addWorkout, deleteWorkout, error } = useWorkoutData();
  const {
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
  } = useWorkoutForm();

  const selectedDateKey = useMemo(() => getDateKey(selectedDate), [selectedDate]);
  const selectedWorkout = useMemo(() => workoutLogs[selectedDateKey], [workoutLogs, selectedDateKey]);

  const handleSaveWorkout = useCallback(async () => {
    if (!currentWorkout.length) {
      Alert.alert('Error', 'Add at least one exercise');
      return;
    }

    const invalidExercises = currentWorkout.filter(ex => !ex.sets.length);
    if (invalidExercises.length) {
      Alert.alert('Error', 'All exercises need at least one set');
      return;
    }

    const workout = {
      id: Date.now(),
      exercises: currentWorkout,
      date: selectedDate.toISOString(),
      completedAt: new Date().toISOString(),
    };

    try {
      await addWorkout({ ...workout, dateKey: selectedDateKey });
      resetForm();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  }, [currentWorkout, selectedDate, selectedDateKey, addWorkout, resetForm]);

  const handleDeleteWorkout = useCallback(() => {
    Alert.alert('Delete Workout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWorkout(selectedDateKey);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete workout. Please try again.');
          }
        }
      }
    ]);
  }, [selectedDateKey, deleteWorkout]);

  const changeMonth = useCallback((direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
    resetForm();
  }, [selectedDate, resetForm]);

  const handleAddExercise = useCallback((name) => {
    addExercise(name);
    setShowExerciseSelection(false);
  }, [addExercise]);

  const handleConfirmAddSet = useCallback(() => {
    if (confirmAddSet()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [confirmAddSet]);

  const handleDragStart = useCallback((index) => {
    setDraggedIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(-1);
  }, []);

  const handleMoveExercise = useCallback((fromIndex, toIndex) => {
    moveExercise(fromIndex, toIndex);
  }, [moveExercise]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorBoundary showRetry={false}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load workout data</Text>
          </View>
        </ErrorBoundary>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Header title="Workout Log" />

          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => changeMonth('prev')}>
              <Ionicons name="chevron-back" size={20} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => changeMonth('next')}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onMonthChange={changeMonth}
            workoutLogs={workoutLogs}
          />

          {/* Selected Date */}
          <View style={styles.selectedDateInfo}>
            <Text style={styles.selectedDateText}>
              {DAYS[selectedDate.getDay()]}, {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
            </Text>
          </View>

          {/* Workout Section */}
          <View style={styles.workoutSection}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutTitle}>Workout</Text>
              {!selectedWorkout && !isCreatingWorkout && (
                <TouchableOpacity style={styles.addButton} onPress={startNewWorkout}>
                  <Ionicons name="add" size={16} color={COLORS.surface} />
                  <Text style={styles.addButtonText}>New</Text>
                </TouchableOpacity>
              )}
              {isCreatingWorkout && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
                  <Ionicons name="save" size={16} color={COLORS.surface} />
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>

            {selectedWorkout ? (
              <WorkoutCard 
                workout={selectedWorkout} 
                onDelete={handleDeleteWorkout}
              />
            ) : isCreatingWorkout ? (
              <View style={styles.workoutCard}>
                <TouchableOpacity
                  style={styles.addExerciseButton}
                  onPress={() => setShowExerciseSelection(true)}
                >
                  <Ionicons name="add" size={24} color={COLORS.info} />
                  <Text style={styles.addExerciseText}>Add Exercise</Text>
                </TouchableOpacity>

                {currentWorkout.map((exercise, i) => (
                  <DraggableExercise
                    key={exercise.id}
                    exercise={exercise}
                    index={i}
                    totalExercises={currentWorkout.length}
                    onRemove={removeExercise}
                    onAddSet={addSet}
                    onRemoveSet={removeSet}
                    onUpdateSet={updateSet}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onMove={handleMoveExercise}
                    draggedIndex={draggedIndex}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No workout for this day</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Exercise Selection Modal */}
        <ExerciseSelectionModal
          visible={showExerciseSelection}
          onClose={() => setShowExerciseSelection(false)}
          onSelectExercise={handleAddExercise}
        />

        {/* Add Set Modal */}
        <AddSetModal
          visible={showAddSetModal}
          onClose={() => setShowAddSetModal(false)}
          newSet={newSet}
          setNewSet={setNewSet}
          onConfirm={handleConfirmAddSet}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  selectedDateInfo: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    borderRadius: 10,
  },
  selectedDateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  workoutSection: {
    margin: SPACING.sm,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  workoutTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 15,
  },
  addButtonText: {
    color: COLORS.surface,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 15,
  },
  saveButtonText: {
    color: COLORS.surface,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  workoutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: SPACING.lg,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.info,
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: SPACING.sm,
  },
  addExerciseText: {
    color: COLORS.info,
    marginLeft: SPACING.sm,
    ...TYPOGRAPHY.body,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: SPACING.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: '#999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default React.memo(LogScreen);