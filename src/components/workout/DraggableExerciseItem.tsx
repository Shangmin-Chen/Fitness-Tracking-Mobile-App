import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise, WorkoutSet } from '../../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface DraggableExerciseItemProps {
  exercise: Exercise;
  onRemove: (id: string | number) => void;
  onAddSet: (exerciseId: string | number) => void;
  onRemoveSet: (exerciseId: string | number, setId: string | number) => void;
  onUpdateSet: (exerciseId: string | number, setId: string | number, field: keyof WorkoutSet, value: any) => void;
  drag: () => void;
  isActive: boolean;
}

const DraggableExerciseItem: React.FC<DraggableExerciseItemProps> = ({
  exercise,
  onRemove,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  drag,
  isActive,
}) => {
  const handleSetChange = (setId: string | number, field: keyof WorkoutSet, value: string) => {
    const numericValue = field === 'reps' || field === 'weight' ? parseFloat(value) || 0 : value;
    onUpdateSet(exercise.id, setId, field, numericValue);
  };

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      {/* Exercise Header */}
      <View style={styles.exerciseHeader}>
        <TouchableOpacity 
          style={styles.dragHandle}
          onPressIn={drag}
          activeOpacity={0.7}
        >
          <Ionicons name="reorder-three" size={20} color={COLORS.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(exercise.id)}
        >
          <Ionicons name="close" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      {/* Sets */}
      <View style={styles.setsContainer}>
        {exercise.sets.map((set, index) => (
          <View key={set.id} style={styles.setRow}>
            <Text style={styles.setNumber}>{index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Reps"
              value={set.reps?.toString() || ''}
              onChangeText={(value) => handleSetChange(set.id, 'reps', value)}
              keyboardType="numeric"
              placeholderTextColor={COLORS.text.disabled}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight"
              value={set.weight?.toString() || ''}
              onChangeText={(value) => handleSetChange(set.id, 'weight', value)}
              keyboardType="numeric"
              placeholderTextColor={COLORS.text.disabled}
            />
            <TouchableOpacity
              style={styles.removeSetButton}
              onPress={() => onRemoveSet(exercise.id, set.id)}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Set Button */}
      <TouchableOpacity
        style={styles.addSetButton}
        onPress={() => onAddSet(exercise.id)}
      >
        <Ionicons name="add" size={16} color={COLORS.info} />
        <Text style={styles.addSetText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeContainer: {
    opacity: 0.8,
    transform: [{ scale: 1.01 }],
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dragHandle: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  exerciseName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  removeButton: {
    padding: SPACING.xs,
  },
  setsContainer: {
    marginBottom: SPACING.lg,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  setNumber: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    width: 24,
    fontWeight: '400',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xs,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  removeSetButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.sm,
  },
  addSetText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
    fontWeight: '400',
  },
});

export default DraggableExerciseItem;
