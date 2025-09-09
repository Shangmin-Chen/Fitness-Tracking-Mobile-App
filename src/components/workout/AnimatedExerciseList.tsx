import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, SPACING } from '../../constants';
import { Exercise } from '../../types';
import DraggableExercise from './DraggableExercise';

interface AnimatedExerciseListProps {
  exercises: Exercise[];
  draggedIndex: number;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string | number) => void;
  onAddSet: (exerciseId: string | number) => void;
  onRemoveSet: (exerciseId: string | number, setId: string | number) => void;
  onUpdateSet: (exerciseId: string | number, setId: string | number, field: string, value: string) => void;
}

const CARD_HEIGHT = 120;
const CARD_MARGIN = 8;
const TOTAL_CARD_HEIGHT = CARD_HEIGHT + CARD_MARGIN;

interface AnimatedExerciseItemProps {
  exercise: Exercise;
  index: number;
  totalExercises: number;
  draggedIndex: number;
  onRemove: (id: string | number) => void;
  onAddSet: (exerciseId: string | number) => void;
  onRemoveSet: (exerciseId: string | number, setId: string | number) => void;
  onUpdateSet: (exerciseId: string | number, setId: string | number, field: string, value: string) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const AnimatedExerciseItem: React.FC<AnimatedExerciseItemProps> = ({
  exercise,
  index,
  totalExercises,
  draggedIndex,
  onRemove,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onDragStart,
  onDragEnd,
  onMove,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isDragging = draggedIndex === index;
    const isAboveDragged = draggedIndex !== -1 && index < draggedIndex;
    const isBelowDragged = draggedIndex !== -1 && index > draggedIndex;
    
    let translateY = 0;
    
    if (isDragging) {
      // The dragged item follows the gesture
      return {
        transform: [{ translateY: 0 }],
        zIndex: 1000,
        elevation: 8,
      };
    }
    
    if (isAboveDragged) {
      // Items above the dragged item move down
      translateY = TOTAL_CARD_HEIGHT;
    } else if (isBelowDragged) {
      // Items below the dragged item move up
      translateY = -TOTAL_CARD_HEIGHT;
    }
    
    return {
      transform: [{ translateY: withSpring(translateY, { damping: 15, stiffness: 150 }) }],
      zIndex: 1,
      elevation: 2,
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <DraggableExercise
        exercise={exercise}
        index={index}
        totalExercises={totalExercises}
        onRemove={onRemove}
        onAddSet={onAddSet}
        onRemoveSet={onRemoveSet}
        onUpdateSet={onUpdateSet}
        draggedIndex={draggedIndex}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onMove={onMove}
      />
    </Animated.View>
  );
};

const AnimatedExerciseList: React.FC<AnimatedExerciseListProps> = ({
  exercises,
  draggedIndex,
  onDragStart,
  onDragEnd,
  onMove,
  onRemove,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
}) => {
  const handleDragStart = (index: number) => {
    onDragStart(index);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    onMove(fromIndex, toIndex);
  };

  return (
    <View style={styles.container}>
      {exercises.map((exercise, index) => (
        <AnimatedExerciseItem
          key={exercise.id}
          exercise={exercise}
          index={index}
          totalExercises={exercises.length}
          draggedIndex={draggedIndex}
          onRemove={onRemove}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
          onUpdateSet={onUpdateSet}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: CARD_MARGIN,
  },
});

export default AnimatedExerciseList;
