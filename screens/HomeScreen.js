import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [workoutStats, setWorkoutStats] = useState({
    todayWorkouts: 0,
    thisWeek: 0,
    totalWorkouts: 0,
    streak: 0,
  });
  const [recentWorkout, setRecentWorkout] = useState(null);

  useEffect(() => {
    loadWorkoutData();
  }, []);

  const loadWorkoutData = async () => {
    try {
      const workoutLogs = await AsyncStorage.getItem('workoutLogs');
      if (workoutLogs) {
        const logs = JSON.parse(workoutLogs);
        calculateStats(logs);
      }
    } catch (error) {
      console.error('Error loading workout data:', error);
    }
  };

  const calculateStats = (logs) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let todayWorkouts = 0;
    let thisWeek = 0;
    let streak = 0;
    const workouts = Object.values(logs).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate today's workouts
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if (workoutDate >= today) {
        todayWorkouts++;
      }
      if (workoutDate >= weekAgo) {
        thisWeek++;
      }
    });

    // Calculate streak
    let currentStreak = 0;
    let checkDate = new Date(today);
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const dateKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
      if (logs[dateKey]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    setWorkoutStats({
      todayWorkouts,
      thisWeek,
      totalWorkouts: Object.keys(logs).length,
      streak: currentStreak,
    });

    if (workouts.length > 0) {
      setRecentWorkout(workouts[0]);
    }
  };

  const quickActions = [
    {
      title: 'Start Workout',
      subtitle: 'Begin a new workout session',
      icon: 'fitness',
      color: '#667eea',
      onPress: () => navigation.navigate('Log'),
    },
    {
      title: 'View Progress',
      subtitle: 'Track your fitness journey',
      icon: 'trending-up',
      color: '#f39c12',
      onPress: () => navigation.navigate('Progress'),
    },
    {
      title: 'Exercise Library',
      subtitle: 'Browse exercise database',
      icon: 'library',
      color: '#e74c3c',
      onPress: () => navigation.navigate('Library'),
    },
    {
      title: 'Templates',
      subtitle: 'Use saved workout routines',
      icon: 'copy',
      color: '#27ae60',
      onPress: () => navigation.navigate('Log'),
    },
  ];

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const QuickActionCard = ({ action }) => (
    <TouchableOpacity
      style={[styles.actionCard, { borderLeftColor: action.color }]}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
        <Ionicons name={action.icon} size={24} color="#fff" />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#bdc3c7" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Good {getGreeting()}</Text>
            <Text style={styles.title}>Ready to train?</Text>
            <Text style={styles.subtitle}>Let's make today count</Text>
          </View>
        </LinearGradient>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Workouts Today"
              value={workoutStats.todayWorkouts}
              icon="fitness"
              color="#667eea"
            />
            <StatCard
              title="This Week"
              value={workoutStats.thisWeek}
              icon="calendar"
              color="#f39c12"
            />
            <StatCard
              title="Total Workouts"
              value={workoutStats.totalWorkouts}
              icon="trophy"
              color="#e74c3c"
            />
            <StatCard
              title="Streak"
              value={`${workoutStats.streak} days`}
              icon="flame"
              color="#27ae60"
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
              <QuickActionCard key={index} action={action} />
            ))}
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "The only bad workout is the one that didn't happen."
          </Text>
          <Text style={styles.quoteAuthor}>- Unknown</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }
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
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statsContainer: {
    padding: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
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
  recentWorkoutCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentWorkoutDate: {
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  quoteCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});
