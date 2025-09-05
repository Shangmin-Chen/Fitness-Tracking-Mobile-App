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
import { LinearGradient } from 'expo-linear-gradient';
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

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
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
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
        </LinearGradient>

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
            color="#3498db"
          />
          <StatCard
            title="This Week"
            value={workoutStats.thisWeek}
            icon="calendar"
            color="#e74c3c"
          />
          <StatCard
            title="This Month"
            value={workoutStats.thisMonth}
            icon="calendar-outline"
            color="#f39c12"
          />
          <StatCard
            title="Total Exercises"
            value={workoutStats.totalExercises}
            icon="barbell"
            color="#27ae60"
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
              <Ionicons name="trophy" size={32} color="#f39c12" />
              <Text style={styles.achievementTitle}>First Workout</Text>
              <Text style={styles.achievementDesc}>Complete your first workout</Text>
            </View>
            <View style={styles.achievementCard}>
              <Ionicons name="flame" size={32} color="#e74c3c" />
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
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 30,
    paddingTop: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  periodSelector: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: '#667eea',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#bdc3c7',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  workoutCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#2c3e50',
  },
  exerciseCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  exerciseList: {
    marginTop: 8,
  },
  exerciseName: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  moreExercises: {
    fontSize: 14,
    color: '#3498db',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 12,
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
