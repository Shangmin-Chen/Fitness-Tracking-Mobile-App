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
} from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

const CARD_HEIGHT = 120;
const CARD_MARGIN = 8;
const TOTAL_CARD_HEIGHT = CARD_HEIGHT + CARD_MARGIN;

const DraggableExercise = ({ 
  exercise, 
  index, 
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

  const gesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.05);
      runOnJS(onDragStart)(index);
    })
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      const newIndex = Math.round(translateY.value / TOTAL_CARD_HEIGHT);
      const targetIndex = Math.max(0, Math.min(exercise.sets.length - 1, index + newIndex));
      
      if (targetIndex !== index) {
        runOnJS(onMove)(index, targetIndex);
      }
      
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      runOnJS(onDragEnd)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ] as any,
    zIndex: draggedIndex === index ? 1000 : 1,
    elevation: interpolate(scale.value, [1, 1.05], [2, 8]),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.exerciseItem, animatedStyle] as any}>
        <View style={styles.exerciseHeader}>
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-three" size={24} color={COLORS.text.secondary} />
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <TouchableOpacity onPress={() => onRemove(exercise.id)}>
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
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
                  value={set.weight}
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
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dragHandle: {
    marginRight: SPACING.sm,
  },
  exerciseName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
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
