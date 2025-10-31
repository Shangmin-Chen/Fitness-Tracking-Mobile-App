import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseInfo } from '../../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import { useExerciseData } from '../../hooks';
import { getMuscleDisplayName, getEquipmentDisplayName } from '../../constants/exercises';

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exerciseName: string) => void;
}

const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({
  visible,
  onClose,
  onSelectExercise,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'all'>('popular');

  // Fetch exercises from API
  const { 
    popularExercises,
    recentExercises,
    exercises,
    loading,
    addToRecent,
  } = useExerciseData();

  // Get exercises based on active tab
  const displayExercises = useMemo(() => {
    if (searchQuery.trim()) {
      return exercises.filter(exercise => {
        const query = searchQuery.toLowerCase();
        return (
          exercise.name.toLowerCase().includes(query) ||
          exercise.primaryMuscles?.some(m => m.toLowerCase().includes(query)) ||
          exercise.equipment?.toLowerCase().includes(query)
        );
      });
    }

    switch (activeTab) {
      case 'recent':
        return recentExercises;
      case 'all':
        return exercises;
      case 'popular':
      default:
        return popularExercises;
    }
  }, [activeTab, searchQuery, popularExercises, recentExercises, exercises]);

  const handleSelectExercise = (exercise: ExerciseInfo) => {
    addToRecent(exercise.id);
    onSelectExercise(exercise.name);
    onClose();
    setSearchQuery(''); // Reset search
  };

  const renderExerciseItem = ({ item }: { item: ExerciseInfo }) => {
    const muscle = item.muscle || (item.primaryMuscles && item.primaryMuscles.length > 0 ? getMuscleDisplayName(item.primaryMuscles[0]) : 'Unknown');
    
    // Get icon based on category
    const getCategoryIcon = () => {
      switch (item.category) {
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
      <TouchableOpacity
        style={styles.exerciseItem}
        onPress={() => handleSelectExercise(item)}
      >
        <View style={styles.iconCircle}>
          <Ionicons name={getCategoryIcon() as any} size={20} color={COLORS.info} />
        </View>
        
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{muscle}</Text>
            {item.equipment && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <Text style={styles.metaText}>{getEquipmentDisplayName(item.equipment)}</Text>
              </>
            )}
          </View>
        </View>
        
        <Ionicons name="add-circle" size={24} color={COLORS.info} />
      </TouchableOpacity>
    );
  };

  const renderTabButton = (tab: 'popular' | 'recent' | 'all', label: string, count?: number) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
        {label}
        {count !== undefined && count > 0 && ` (${count})`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modal}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={COLORS.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search exercises..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.text.disabled}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Tabs */}
          {!searchQuery && (
            <View style={styles.tabsContainer}>
              {renderTabButton('popular', 'Popular', popularExercises.length)}
              {renderTabButton('recent', 'Recent', recentExercises.length)}
              {renderTabButton('all', 'All', exercises.length)}
            </View>
          )}

          {/* Exercise Count */}
          {!loading && (
            <View style={styles.countContainer}>
              <Text style={styles.countText}>
                {displayExercises.length} exercise{displayExercises.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          {/* Exercise List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.info} />
              <Text style={styles.loadingText}>Loading exercises...</Text>
            </View>
          ) : (
            <FlatList
              data={displayExercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item.id}
              style={styles.exerciseList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={48} color={COLORS.text.disabled} />
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No exercises found' : 'No exercises yet'}
                  </Text>
                  <Text style={styles.emptySubtext}>
                    {searchQuery ? 'Try a different search term' : 'Start using exercises to see them here'}
                  </Text>
                </View>
              }
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    height: '85%',
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  tabButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButtonActive: {
    backgroundColor: COLORS.text.primary,
    borderColor: COLORS.text.primary,
  },
  tabButtonText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  tabButtonTextActive: {
    color: COLORS.surface,
  },
  countContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  countText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  exerciseList: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.info}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  exerciseInfo: {
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
  metaText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontSize: 13,
  },
  metaDivider: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.disabled,
    marginHorizontal: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.lg,
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.lg,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  emptySubtext: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default ExerciseSelectionModal;
