import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';
import { getDifficultyColor } from '../../utils/workout';
import { getEquipmentDisplayName, getMuscleDisplayName } from '../../constants/exercises';
import { ExerciseInfo } from '../../types';

interface ExerciseCardProps {
  exercise: ExerciseInfo;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  showImage?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onPress, 
  style,
  showImage = false // Default to false for better performance
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const hasImage = exercise.images && exercise.images.length > 0;
  const primaryImage = hasImage ? exercise.images[0] : null;
  
  // Get display values with fallbacks
  const difficulty = exercise.difficulty || (exercise.level ? exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1) : 'Beginner');
  const muscle = exercise.muscle || (exercise.primaryMuscles && exercise.primaryMuscles.length > 0 ? getMuscleDisplayName(exercise.primaryMuscles[0]) : 'Unknown');
  const description = exercise.description || (exercise.instructions && exercise.instructions.length > 0 ? exercise.instructions[0] : 'No description available');
  
  // Determine icon based on category
  const getCategoryIcon = () => {
    switch (exercise.category) {
      case 'Chest': return 'body-outline';
      case 'Back': return 'git-pull-request-outline';
      case 'Legs': return 'walk-outline';
      case 'Shoulders': return 'triangle-outline';
      case 'Arms': return 'fitness-outline';
      case 'Core': return 'ellipse-outline';
      case 'Cardio': return 'heart-outline';
      default: return 'barbell-outline';
    }
  };
  
  return (
    <TouchableOpacity style={[styles.exerciseCard, style]} onPress={onPress} activeOpacity={0.6}>
      {/* Icon/Image Section - Always show icon, optionally show image */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name={getCategoryIcon() as any} size={24} color={COLORS.info} />
        </View>
      </View>
      
      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.exerciseName} numberOfLines={1}>{exercise.name}</Text>
        
        <View style={styles.metaRow}>
          <Text style={styles.exerciseMuscle}>{muscle}</Text>
          {exercise.equipment && (
            <>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.equipmentText}>{getEquipmentDisplayName(exercise.equipment)}</Text>
            </>
          )}
        </View>
      </View>
      
      {/* Chevron */}
      <Ionicons name="chevron-forward" size={20} color={COLORS.text.disabled} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  iconContainer: {
    marginRight: SPACING.lg,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.info}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  exerciseName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseMuscle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontSize: 13,
  },
  metaDivider: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.disabled,
    marginHorizontal: SPACING.xs,
  },
  equipmentText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontSize: 13,
  },
});

export default ExerciseCard;
