import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

const WorkoutCard = ({ workout, onDelete, style }) => (
  <View style={[styles.workoutCard, style]}>
    {onDelete && (
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={20} color={COLORS.error} />
      </TouchableOpacity>
    )}
    <View style={styles.workoutHeader}>
      <Text style={styles.workoutDate}>
        {new Date(workout.date).toLocaleDateString()}
      </Text>
      <Text style={styles.exerciseCount}>
        {workout.exercises.length} exercises
      </Text>
    </View>
    <View style={styles.exerciseList}>
      {workout.exercises.slice(0, 3).map((exercise, index) => (
        <Text key={index} style={styles.exerciseName}>
          • {exercise.name}
        </Text>
      ))}
      {workout.exercises.length > 3 && (
        <Text style={styles.moreExercises}>
          +{workout.exercises.length - 3} more
        </Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  workoutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    zIndex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  workoutDate: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    letterSpacing: -0.2,
  },
  exerciseCount: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  exerciseList: {
    marginTop: SPACING.sm,
  },
  exerciseName: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    fontWeight: '400',
  },
  moreExercises: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});

export default WorkoutCard;
