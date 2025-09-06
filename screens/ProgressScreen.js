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
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalExercises: 0,
    averageWorkoutDuration: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const workoutLogs = await AsyncStorage.getItem('workoutLogs');
      if (workoutLogs) {
        const logs = JSON.parse(workoutLogs);
        calculateStats(logs);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const calculateStats = (logs) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let thisWeek = 0;
    let thisMonth = 0;
    let totalExercises = 0;
    const workouts = [];

    Object.values(logs).forEach(workout => {
      const workoutDate = new Date(workout.date);
      totalExercises += workout.exercises.length;
      workouts.push(workout);

      if (workoutDate >= weekAgo) {
        thisWeek++;
      }
      if (workoutDate >= monthAgo) {
        thisMonth++;
      }
    });

    setWorkoutStats({
      totalWorkouts: Object.keys(logs).length,
      thisWeek,
      thisMonth,
      totalExercises,
      averageWorkoutDuration: 45, // Mock data
    });

    setRecentWorkouts(workouts.slice(-5).reverse());
  };

  const StatCard = ({ title, value, subtitle, icon }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>
          <Ionicons name={icon} size={20} color="#1a1a1a" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const WorkoutCard = ({ workout }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutDate}>
          {new Date(workout.date).toLocaleDateString()}
        </Text>
        <Text style={styles.exerciseCount}>
          {workout.exercises.length} exercises
        </Text>
      </View>
      <View style={styles.exerciseList}>
        {workout.exercises.slice(0, 3).map((exercise, index) => (
          <Text key={index} style={styles.exerciseName}>
            • {exercise.name}
          </Text>
        ))}
        {workout.exercises.length > 3 && (
          <Text style={styles.moreExercises}>
            +{workout.exercises.length - 3} more
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
          <View style={styles.headerPattern}>
            <View style={styles.patternDot} />
            <View style={[styles.patternDot, styles.patternDotSmall]} />
            <View style={[styles.patternDot, styles.patternDotLarge]} />
          </View>
        </View>

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
          />
          <StatCard
            title="This Week"
            value={workoutStats.thisWeek}
            icon="calendar"
          />
          <StatCard
            title="This Month"
            value={workoutStats.thisMonth}
            icon="calendar-outline"
          />
          <StatCard
            title="Total Exercises"
            value={workoutStats.totalExercises}
            icon="barbell"
          />
        </View>

        {/* Recent Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout, index) => (
              <WorkoutCard key={index} workout={workout} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={48} color="#bdc3c7" />
              <Text style={styles.emptyStateText}>No workouts yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start logging workouts to see your progress here
              </Text>
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementCard}>
              <View style={styles.achievementIconContainer}>
                <Ionicons name="trophy" size={24} color="#1a1a1a" />
              </View>
              <Text style={styles.achievementTitle}>First Workout</Text>
              <Text style={styles.achievementDesc}>Complete your first workout</Text>
            </View>
            <View style={styles.achievementCard}>
              <View style={styles.achievementIconContainer}>
                <Ionicons name="flame" size={24} color="#1a1a1a" />
              </View>
              <Text style={styles.achievementTitle}>Streak Master</Text>
              <Text style={styles.achievementDesc}>Workout 7 days in a row</Text>
            </View>
          </View>
        </View>
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
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: '#1a1a1a',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    letterSpacing: -0.2,
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    letterSpacing: -0.2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#c7c7cc',
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
    letterSpacing: -0.3,
  },
  workoutCard: {
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
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: -0.2,
  },
  exerciseCount: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
  },
  exerciseList: {
    marginTop: 8,
  },
  exerciseName: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 4,
    fontWeight: '400',
  },
  moreExercises: {
    fontSize: 14,
    color: '#1a1a1a',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
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
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'center',
    fontWeight: '400',
  },
});
