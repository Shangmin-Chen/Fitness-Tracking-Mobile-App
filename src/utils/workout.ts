import { Workout, WorkoutStats } from '../types';

/**
 * Calculate workout statistics from logs
 */
export const calculateWorkoutStats = (logs: Record<string, Workout>): WorkoutStats => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let todayWorkouts = 0;
  let thisWeek = 0;
  let thisMonth = 0;
  let totalExercises = 0;
  let streak = 0;
  const workouts = Object.values(logs).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate today's workouts
  workouts.forEach(workout => {
    const workoutDate = new Date(workout.date);
    totalExercises += workout.exercises.length;

    if (workoutDate >= today) {
      todayWorkouts++;
    }
    if (workoutDate >= weekAgo) {
      thisWeek++;
    }
    if (workoutDate >= monthAgo) {
      thisMonth++;
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

  return {
    todayWorkouts,
    thisWeek,
    thisMonth,
    totalWorkouts: Object.keys(logs).length,
    totalExercises,
    streak: currentStreak,
    averageWorkoutDuration: 45, // Mock data
  };
};

/**
 * Get difficulty color for exercise
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Beginner': return '#8e8e93';
    case 'Intermediate': return '#1a1a1a';
    case 'Advanced': return '#1a1a1a';
    default: return '#c7c7cc';
  }
};
