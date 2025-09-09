import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import { Exercise } from '../../types';

interface DraggableExerciseProps {
  exercise: Exercise;
  index: number;
  totalExercises: number;
  onRemove: (id: string | number) => void;
  onAddSet: (exerciseId: string | number) => void;
  onRemoveSet: (exerciseId: string | number, setId: string | number) => void;
  onUpdateSet: (exerciseId: string | number, setId: string | number, field: string, value: string) => void;
  draggedIndex: number;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const CARD_HEIGHT = 120;
const CARD_MARGIN = 8;
const TOTAL_CARD_HEIGHT = CARD_HEIGHT + CARD_MARGIN;

const DraggableExercise: React.FC<DraggableExerciseProps> = ({ 
  exercise, 
  index, 
  totalExercises,
  onRemove, 
  onAddSet, 
  onRemoveSet, 
  onUpdateSet,
  draggedIndex,
  onDragStart,
  onDragEnd,
  onMove
}) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const isDragging = draggedIndex === index;

  const gesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.05, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(0.95, { duration: 200 });
      runOnJS(onDragStart)(index);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    })
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      const newIndex = Math.round(translateY.value / TOTAL_CARD_HEIGHT);
      const targetIndex = Math.max(0, Math.min(totalExercises - 1, index + newIndex));
      
      if (targetIndex !== index) {
        runOnJS(onMove)(index, targetIndex);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
      
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 200 });
      runOnJS(onDragEnd)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ] as any,
    opacity: opacity.value,
    zIndex: isDragging ? 1000 : 1,
    elevation: interpolate(scale.value, [1, 1.05], [2, 8]),
    shadowColor: isDragging ? COLORS.primary : 'transparent',
    shadowOffset: {
      width: 0,
      height: interpolate(scale.value, [1, 1.05], [2, 8]),
    },
    shadowOpacity: interpolate(scale.value, [1, 1.05], [0.1, 0.3]),
    shadowRadius: interpolate(scale.value, [1, 1.05], [4, 12]),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.exerciseItem, animatedStyle] as any}>
        <View style={[styles.exerciseHeader, isDragging && styles.draggingHeader]}>
          <View style={[styles.dragHandle, isDragging && styles.draggingHandle]}>
            <Ionicons 
              name="reorder-three" 
              size={24} 
              color={isDragging ? COLORS.info : COLORS.text.secondary} 
            />
          </View>
          <Text style={[styles.exerciseName, isDragging && styles.draggingText]}>
            {exercise.name}
          </Text>
          <TouchableOpacity 
            onPress={() => onRemove(exercise.id)}
            style={styles.removeButton}
            disabled={isDragging}
          >
            <Ionicons 
              name="trash-outline" 
              size={18} 
              color={isDragging ? COLORS.text.disabled : COLORS.error} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.setsContainer}>
          <View style={styles.setsHeader}>
            <Text style={styles.setsHeaderText}>Sets ({exercise.sets.length})</Text>
            <TouchableOpacity
              style={styles.addSetButton}
              onPress={() => onAddSet(exercise.id)}
            >
              <Ionicons name="add" size={16} color={COLORS.info} />
              <Text style={styles.addSetButtonText}>Add Set</Text>
            </TouchableOpacity>
          </View>

          {exercise.sets.length === 0 ? (
            <Text style={styles.noSetsText}>No sets added</Text>
          ) : (
            exercise.sets.map((set, i) => (
              <View key={set.id} style={styles.setItem}>
                <Text style={styles.setNumber}>{i + 1}</Text>
                <TextInput
                  style={styles.setInput}
                  value={String(set.reps)}
                  onChangeText={(text) => onUpdateSet(exercise.id, set.id, 'reps', text)}
                  keyboardType="numeric"
                  placeholder="Reps"
                />
                <TextInput
                  style={styles.setInput}
                  value={String(set.weight || '')}
                  onChangeText={(text) => onUpdateSet(exercise.id, set.id, 'weight', text)}
                  placeholder="Weight"
                />
                <TouchableOpacity onPress={() => onRemoveSet(exercise.id, set.id)}>
                  <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  exerciseItem: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: CARD_MARGIN,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  draggingHeader: {
    backgroundColor: COLORS.info + '10',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    margin: -SPACING.xs,
  },
  dragHandle: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  draggingHandle: {
    backgroundColor: COLORS.info + '20',
  },
  exerciseName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
  },
  draggingText: {
    color: COLORS.info,
  },
  removeButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  setsContainer: {
    marginTop: SPACING.xs,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  setsHeaderText: {
    ...TYPOGRAPHY.bodySmall,
    color: '#666',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addSetButtonText: {
    color: COLORS.info,
    marginLeft: SPACING.xs,
    ...TYPOGRAPHY.bodySmall,
  },
  noSetsText: {
    ...TYPOGRAPHY.bodySmall,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: SPACING.sm,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  setNumber: {
    width: 20,
    ...TYPOGRAPHY.bodySmall,
    color: '#666',
  },
  setInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginHorizontal: SPACING.xs,
    ...TYPOGRAPHY.bodySmall,
  },
});

export default DraggableExercise;
