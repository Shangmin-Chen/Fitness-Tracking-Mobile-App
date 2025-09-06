import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExerciseLibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

  const exercises = [
    // Chest
    { name: 'Bench Press', category: 'Chest', difficulty: 'Intermediate', muscle: 'Chest', description: 'Classic chest exercise performed with a barbell' },
    { name: 'Incline Dumbbell Press', category: 'Chest', difficulty: 'Intermediate', muscle: 'Chest', description: 'Upper chest focused exercise' },
    { name: 'Push-ups', category: 'Chest', difficulty: 'Beginner', muscle: 'Chest', description: 'Bodyweight chest exercise' },
    { name: 'Chest Flyes', category: 'Chest', difficulty: 'Beginner', muscle: 'Chest', description: 'Isolation exercise for chest muscles' },
    { name: 'Dips', category: 'Chest', difficulty: 'Intermediate', muscle: 'Chest', description: 'Bodyweight exercise targeting chest and triceps' },
    
    // Back
    { name: 'Deadlifts', category: 'Back', difficulty: 'Advanced', muscle: 'Back', description: 'Compound exercise for entire posterior chain' },
    { name: 'Pull-ups', category: 'Back', difficulty: 'Intermediate', muscle: 'Back', description: 'Bodyweight back exercise' },
    { name: 'Barbell Rows', category: 'Back', difficulty: 'Intermediate', muscle: 'Back', description: 'Horizontal pulling exercise' },
    { name: 'Lat Pulldowns', category: 'Back', difficulty: 'Beginner', muscle: 'Back', description: 'Machine-based vertical pulling exercise' },
    { name: 'T-Bar Rows', category: 'Back', difficulty: 'Intermediate', muscle: 'Back', description: 'Variation of rowing exercise' },
    
    // Legs
    { name: 'Squats', category: 'Legs', difficulty: 'Intermediate', muscle: 'Legs', description: 'King of all exercises for lower body' },
    { name: 'Lunges', category: 'Legs', difficulty: 'Beginner', muscle: 'Legs', description: 'Unilateral leg exercise' },
    { name: 'Leg Press', category: 'Legs', difficulty: 'Beginner', muscle: 'Legs', description: 'Machine-based leg exercise' },
    { name: 'Romanian Deadlifts', category: 'Legs', difficulty: 'Intermediate', muscle: 'Legs', description: 'Hip hinge movement for hamstrings' },
    { name: 'Calf Raises', category: 'Legs', difficulty: 'Beginner', muscle: 'Legs', description: 'Isolation exercise for calves' },
    
    // Shoulders
    { name: 'Overhead Press', category: 'Shoulders', difficulty: 'Intermediate', muscle: 'Shoulders', description: 'Vertical pressing movement' },
    { name: 'Lateral Raises', category: 'Shoulders', difficulty: 'Beginner', muscle: 'Shoulders', description: 'Isolation exercise for side delts' },
    { name: 'Rear Delt Flyes', category: 'Shoulders', difficulty: 'Beginner', muscle: 'Shoulders', description: 'Posterior deltoid exercise' },
    { name: 'Face Pulls', category: 'Shoulders', difficulty: 'Beginner', muscle: 'Shoulders', description: 'Rear delt and upper trap exercise' },
    
    // Arms
    { name: 'Bicep Curls', category: 'Arms', difficulty: 'Beginner', muscle: 'Biceps', description: 'Classic bicep isolation exercise' },
    { name: 'Tricep Dips', category: 'Arms', difficulty: 'Intermediate', muscle: 'Triceps', description: 'Bodyweight tricep exercise' },
    { name: 'Hammer Curls', category: 'Arms', difficulty: 'Beginner', muscle: 'Biceps', description: 'Bicep exercise with neutral grip' },
    { name: 'Close-Grip Bench Press', category: 'Arms', difficulty: 'Intermediate', muscle: 'Triceps', description: 'Tricep-focused pressing movement' },
    
    // Core
    { name: 'Planks', category: 'Core', difficulty: 'Beginner', muscle: 'Core', description: 'Isometric core exercise' },
    { name: 'Russian Twists', category: 'Core', difficulty: 'Beginner', muscle: 'Core', description: 'Rotational core exercise' },
    { name: 'Mountain Climbers', category: 'Core', difficulty: 'Intermediate', muscle: 'Core', description: 'Dynamic core exercise' },
    { name: 'Dead Bug', category: 'Core', difficulty: 'Beginner', muscle: 'Core', description: 'Stability-focused core exercise' },
    
    // Cardio
    { name: 'Running', category: 'Cardio', difficulty: 'Beginner', muscle: 'Full Body', description: 'Cardiovascular exercise' },
    { name: 'Cycling', category: 'Cardio', difficulty: 'Beginner', muscle: 'Legs', description: 'Low-impact cardio exercise' },
    { name: 'Rowing', category: 'Cardio', difficulty: 'Intermediate', muscle: 'Full Body', description: 'Full-body cardio exercise' },
    { name: 'Jump Rope', category: 'Cardio', difficulty: 'Beginner', muscle: 'Full Body', description: 'High-intensity cardio exercise' },
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#8e8e93';
      case 'Intermediate': return '#1a1a1a';
      case 'Advanced': return '#1a1a1a';
      default: return '#c7c7cc';
    }
  };

  const ExerciseCard = ({ exercise }) => (
    <TouchableOpacity style={styles.exerciseCard} activeOpacity={0.6}>
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
        <Ionicons name="chevron-forward" size={16} color="#8e8e93" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Exercise Library</Text>
          <Text style={styles.headerSubtitle}>Discover new exercises</Text>
          <View style={styles.headerPattern}>
            <View style={styles.patternSquare} />
            <View style={[styles.patternSquare, styles.patternSquareSmall]} />
            <View style={[styles.patternSquare, styles.patternSquareLarge]} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#7f8c8d" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#7f8c8d"
            />
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exercise Count */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredExercises.length} exercises found
          </Text>
        </View>

        {/* Exercise List */}
        <View style={styles.exercisesContainer}>
          {filteredExercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </View>

        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No exercises found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 30,
    paddingTop: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '400',
  },
  headerPattern: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  patternSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    borderRadius: 2,
  },
  patternSquareSmall: {
    width: 8,
    height: 8,
    marginLeft: 16,
  },
  patternSquareLarge: {
    width: 10,
    height: 10,
    marginLeft: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  categoryContainer: {
    paddingVertical: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    letterSpacing: -0.2,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  countContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  countText: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
  },
  exercisesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    letterSpacing: -0.3,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  exerciseMuscle: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#8e8e93',
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '400',
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#8e8e93',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8e8e93',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#c7c7cc',
    textAlign: 'center',
    fontWeight: '400',
  },
});
