export const DEFAULT_EXERCISES = [
  'Bench Press', 'Squats', 'Deadlifts', 'Overhead Press',
  'Barbell Rows', 'Pull-ups', 'Push-ups', 'Lunges',
  'Bicep Curls', 'Tricep Dips', 'Planks', 'Leg Press',
  'Lat Pulldowns', 'Chest Flyes', 'Shoulder Press',
];

export const EXERCISE_CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

export const EXERCISES = [
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
