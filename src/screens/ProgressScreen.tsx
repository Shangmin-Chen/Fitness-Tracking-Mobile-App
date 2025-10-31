import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutData } from '../hooks';
import { Header, StatCard, WorkoutCard, EmptyState } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { getWorkoutStats, workoutLogs } = useWorkoutData();
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalExercises: 0,
    averageWorkoutDuration: 0,
  });
  const [pastWorkouts, setPastWorkouts] = useState([] as any[]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    const stats = getWorkoutStats();
    setWorkoutStats(stats);
    const all = Object.values(workoutLogs || {}).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setPastWorkouts(all);
  };

  const headerPattern = (
    <>
      <View style={styles.patternDot} />
      <View style={[styles.patternDot, styles.patternDotSmall]} />
      <View style={[styles.patternDot, styles.patternDotLarge]} />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="History"
          subtitle="View past workouts"
          pattern={headerPattern}
        />

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'all'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Workouts"
            value={workoutStats.totalWorkouts}
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
            title="This Month"
            value={workoutStats.thisMonth}
            icon="calendar-outline"
            style={styles.statCard}
          />
          <StatCard
            title="Total Exercises"
            value={workoutStats.totalExercises}
            icon="barbell"
            style={styles.statCard}
          />
        </View>

        {/* Past Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Workouts</Text>
          {pastWorkouts.length > 0 ? (
            pastWorkouts.map((workout, index) => (
              <WorkoutCard key={index} workout={workout} style={styles.workoutCard} />
            ))
          ) : (
            <EmptyState
              icon="fitness-outline"
              title="No workouts yet"
              subtitle="Start creating workouts to see them here"
            />
          )}
        </View>

        {/* Achievements removed per simplification */}
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
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
  },
  patternDotSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: 12,
  },
  patternDotLarge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  periodSelector: {
    flexDirection: 'row',
    margin: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: COLORS.text.primary,
  },
  periodButtonText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.text.secondary,
    letterSpacing: -0.2,
  },
  periodButtonTextActive: {
    color: COLORS.surface,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: (width - 60) / 2,
    marginHorizontal: SPACING.xs,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    letterSpacing: -0.3,
  },
  workoutCard: {
    marginBottom: SPACING.md,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  achievementTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    letterSpacing: -0.2,
  },
  achievementDesc: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontWeight: '400',
  },
});