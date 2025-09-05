import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import LogScreen from './screens/LogScreen';
import ProgressScreen from './screens/ProgressScreen';
import ExerciseLibraryScreen from './screens/ExerciseLibraryScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Log') {
              iconName = focused ? 'fitness' : 'fitness-outline';
            } else if (route.name === 'Progress') {
              iconName = focused ? 'trending-up' : 'trending-up-outline';
            } else if (route.name === 'Library') {
              iconName = focused ? 'library' : 'library-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: '#7f8c8d',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0,
            paddingBottom: Platform.OS === 'ios' ? 20 : 5,
            paddingTop: 5,
            height: Platform.OS === 'ios' ? 85 : 60,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 8,
          },
          headerShown: false,
          unmountOnBlur: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Home',
          }}
        />
        <Tab.Screen 
          name="Log" 
          component={LogScreen}
          options={{
            title: 'Workout',
          }}
        />
        <Tab.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{
            title: 'Progress',
          }}
        />
        <Tab.Screen 
          name="Library" 
          component={ExerciseLibraryScreen}
          options={{
            title: 'Exercises',
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
