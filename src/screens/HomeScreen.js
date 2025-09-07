import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutData } from '../hooks';
import { Header, StatCard, ActionCard, EmptyState, ErrorBoundary } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';
import { getGreeting } from '../utils';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { workoutStats, recentWorkouts, loading, error } = useWorkoutData();
  
  const recentWorkout = useMemo(() => {
    return recentWorkouts.length > 0 ? recentWorkouts[0] : null;
  }, [recentWorkouts]);

  const quickActions = useMemo(() => [
    {
      title: 'Start Workout',
      subtitle: 'Begin a new workout session',
      icon: 'fitness',
      onPress: () => navigation.navigate('Log'),
    },
    {
      title: 'View Progress',
      subtitle: 'Track your fitness journey',
      icon: 'trending-up',
      onPress: () => navigation.navigate('Progress'),
    },
    {
      title: 'Exercise Library',
      subtitle: 'Browse exercise database',
      icon: 'library',
      onPress: () => navigation.navigate('Library'),
    },
    {
      title: 'Templates',
      subtitle: 'Use saved workout routines',
      icon: 'copy',
      onPress: () => navigation.navigate('Log'),
    },
  ], [navigation]);

  const headerPattern = (
    <>
      <View style={styles.patternCircle} />
      <View style={[styles.patternCircle, styles.patternCircleSmall]} />
      <View style={[styles.patternCircle, styles.patternCircleLarge]} />
    </>
  );

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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Ready to train?"
          subtitle="Let's make today count"
          pattern={headerPattern}
        />

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Workouts Today"
              value={workoutStats.todayWorkouts}
              icon="fitness"
              style={styles.statCard}
            />
            <StatCard
              title="This Week"
              value={workoutStats.thisWeek}
              icon="calendar"
              style={styles.statCard}
            />
            <StatCard
              title="Total Workouts"
              value={workoutStats.totalWorkouts}
              icon="trophy"
              style={styles.statCard}
            />
            <StatCard
              title="Streak"
              value={`${workoutStats.streak} days`}
              icon="flame"
              style={styles.statCard}
            />
          </View>
        </View>

        {/* Recent Workout */}
        {recentWorkout && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Workout</Text>
            <View style={styles.recentWorkoutCard}>
              <View style={styles.recentWorkoutHeader}>
                <Text style={styles.recentWorkoutDate}>
                  {new Date(recentWorkout.date).toLocaleDateString()}
                </Text>
                <Text style={styles.exerciseCount}>
                  {recentWorkout.exercises.length} exercises
                </Text>
              </View>
              <View style={styles.exerciseList}>
                {recentWorkout.exercises.slice(0, 3).map((exercise, index) => (
                  <Text key={index} style={styles.exerciseName}>
                    • {exercise.name}
                  </Text>
                ))}
                {recentWorkout.exercises.length > 3 && (
                  <Text style={styles.moreExercises}>
                    +{recentWorkout.exercises.length - 3} more
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <ActionCard key={index} action={action} style={styles.actionCard} />
            ))}
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteIcon}>
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.text.secondary} />
          </View>
          <Text style={styles.quoteText}>
            "The only bad workout is the one that didn't happen."
          </Text>
          <Text style={styles.quoteAuthor}>- Unknown</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    width: 60,
    height: 60,
    top: 20,
    right: 20,
  },
  patternCircleSmall: {
    width: 30,
    height: 30,
    top: 40,
    right: 60,
    backgroundColor: '#e8e8e8',
  },
  patternCircleLarge: {
    width: 40,
    height: 40,
    top: 60,
    right: 10,
    backgroundColor: '#f0f0f0',
  },
  statsContainer: {
    padding: SPACING.xl,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
  },
  recentWorkoutCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
  },
  recentWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  recentWorkoutDate: {
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
  },
  quoteCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.xl,
    padding: 25,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
  },
  quoteIcon: {
    marginBottom: SPACING.md,
  },
  quoteText: {
    ...TYPOGRAPHY.body,
    fontStyle: 'italic',
    color: COLORS.text.primary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.md,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  quoteAuthor: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
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

export default React.memo(HomeScreen);