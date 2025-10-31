import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutData } from '../hooks';
import { Header, ActionCard, ErrorBoundary } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';
import { getGreeting } from '../utils';
import { NavigationProps } from '../types';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const { error } = useWorkoutData();

  const quickActions = useMemo(() => [
    {
      title: 'Create New Workout',
      subtitle: 'Start a new workout',
      icon: 'fitness',
      onPress: () => navigation.navigate('Create'),
    },
    {
      title: 'History',
      subtitle: 'View past workouts',
      icon: 'time',
      onPress: () => navigation.navigate('History'),
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
          subtitle="Keep it simple"
          pattern={headerPattern}
        />

        {/* Quick Actions (Simplified) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <ActionCard 
                key={index} 
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                onPress={action.onPress}
                style={styles.actionCard} 
              />
            ))}
          </View>
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
  quoteCard: {},
  quoteIcon: {},
  quoteText: {},
  quoteAuthor: {},
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