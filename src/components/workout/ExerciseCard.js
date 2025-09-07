import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';
import { getDifficultyColor } from '../../utils/workout';

const ExerciseCard = ({ exercise, onPress, style }) => (
  <TouchableOpacity style={[styles.exerciseCard, style]} onPress={onPress} activeOpacity={0.6}>
    <View style={styles.exerciseHeader}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
        <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
      </View>
    </View>
    <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
    <Text style={styles.exerciseDescription}>{exercise.description}</Text>
    <View style={styles.exerciseFooter}>
      <View style={styles.categoryTag}>
        <Text style={styles.categoryText}>{exercise.category}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.text.secondary} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  exerciseName: {
    ...TYPOGRAPHY.h4,
    flex: 1,
    letterSpacing: -0.3,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.surface,
  },
  exerciseMuscle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    letterSpacing: -0.2,
  },
  exerciseDescription: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
    marginBottom: SPACING.md,
    fontWeight: '400',
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
});

export default ExerciseCard;
