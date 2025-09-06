import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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
  ];

  const StatCard = ({ title, value, subtitle, icon }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>
          <Ionicons name={icon} size={18} color="#1a1a1a" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const QuickActionCard = ({ action }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={action.onPress}
      activeOpacity={0.6}
    >
      <View style={styles.actionIcon}>
        <Ionicons name={action.icon} size={20} color="#1a1a1a" />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#8e8e93" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Good {getGreeting()}</Text>
            <Text style={styles.title}>Ready to train?</Text>
            <Text style={styles.subtitle}>Let's make today count</Text>
          </View>
          <View style={styles.headerPattern}>
            <View style={styles.patternCircle} />
            <View style={[styles.patternCircle, styles.patternCircleSmall]} />
            <View style={[styles.patternCircle, styles.patternCircleLarge]} />
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Workouts Today"
              value={workoutStats.todayWorkouts}
              icon="fitness"
            />
            <StatCard
              title="This Week"
              value={workoutStats.thisWeek}
              icon="calendar"
            />
            <StatCard
              title="Total Workouts"
              value={workoutStats.totalWorkouts}
              icon="trophy"
            />
            <StatCard
              title="Streak"
              value={`${workoutStats.streak} days`}
              icon="flame"
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
          <View style={styles.quoteIcon}>
            <Ionicons name="quote" size={24} color="#8e8e93" />
          </View>
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
  headerContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    zIndex: 1,
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
  greeting: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    fontWeight: '400',
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
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
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
  recentWorkoutCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f8f8',
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
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#8e8e93',
    fontWeight: '400',
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  quoteIcon: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
  },
});
