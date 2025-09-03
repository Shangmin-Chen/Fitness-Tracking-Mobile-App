# 2Plates - Your Gym Companion

A React Native fitness tracking app built with Expo that helps you log workouts, track progress, and manage your fitness journey.

## Features

### 🏠 Home Screen
- Quick access to main features
- Navigation to workout logging
- Getting started guide
- Progress overview

### 📅 Workout Log Screen
- **Calendar View**: Navigate between months and select dates
- **Workout Logging**: Add exercises with sets, reps, and weight
- **Exercise Library**: Quick access to common exercises
- **Custom Exercises**: Add your own exercises
- **Workout Templates**: Save and reuse workout routines
- **Progress Tracking**: View completed workouts by date

## Navigation

The app uses a bottom tab navigator with two main screens:

1. **Home** - Landing page with quick actions
2. **Log** - Workout logging and calendar view

### Navigation Features
- Smooth transitions between screens
- Persistent state across navigation
- Month navigation in calendar
- Date selection for workout logging

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 2plates
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
- **Web**: Press `w` or visit the web URL
- **iOS**: Press `i` (requires iOS Simulator)
- **Android**: Press `a` (requires Android Emulator)

## Usage

### Logging a Workout

1. Navigate to the **Log** tab
2. Select a date on the calendar
3. Tap **"New Workout"**
4. Add exercises by:
   - Tapping exercise chips from the library
   - Using **"Custom Exercise"** for unique exercises
5. Fill in sets, reps, and weight for each exercise
6. Save the workout

### Using Templates

1. Create a workout as described above
2. Tap **"Save as Template"** before saving
3. Next time, tap **"New Workout"** and select your template

### Calendar Navigation

- Use the arrow buttons to navigate between months
- Tap any date to view or log workouts
- Green dots indicate days with logged workouts
- Orange highlight shows the selected date
- Blue highlight shows today's date

## Technical Details

### Dependencies
- React Native 0.79.6
- Expo SDK 53
- React Navigation 7
- Expo Vector Icons

### File Structure
```
2plates/
├── App.js              # Main app component with navigation
├── screens/
│   ├── HomeScreen.js   # Home screen with quick actions
│   └── LogScreen.js    # Workout logging and calendar
├── assets/             # App icons and images
└── package.json        # Dependencies and scripts
```

### Key Features Implemented

#### Bug Fixes
- ✅ Added missing `@expo/vector-icons` dependency
- ✅ Fixed navigation configuration with proper screen options
- ✅ Improved error handling for exercise validation
- ✅ Fixed Alert.prompt compatibility issues
- ✅ Enhanced calendar navigation with month controls
- ✅ Added proper input validation for sets and reps

#### Navigation Improvements
- ✅ Smooth tab navigation between Home and Log screens
- ✅ Quick action buttons on Home screen for easy access
- ✅ Month navigation in calendar view
- ✅ Proper screen state management

#### User Experience
- ✅ Intuitive calendar interface
- ✅ Quick exercise selection
- ✅ Form validation and error messages
- ✅ Responsive design for different screen sizes
- ✅ Clear visual indicators for workout days

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
