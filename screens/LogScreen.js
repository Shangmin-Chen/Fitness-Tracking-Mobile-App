import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  FlatList,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function LogScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutLogs, setWorkoutLogs] = useState({});
  const [templates, setTemplates] = useState({});
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '3',
    reps: '10',
    weight: '',
  });
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  const loadData = async () => {
    try {
      const [workoutData, templateData] = await Promise.all([
        AsyncStorage.getItem('workoutLogs'),
        AsyncStorage.getItem('templates'),
      ]);
      
      if (workoutData) {
        setWorkoutLogs(JSON.parse(workoutData));
      }
      if (templateData) {
        setTemplates(JSON.parse(templateData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove(['workoutLogs', 'templates']);
      setWorkoutLogs({});
      setTemplates({});
      setCurrentWorkout([]);
      setIsCreatingWorkout(false);
      setLastSaved(null);
      Alert.alert('Success', 'All data cleared!');
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const saveWorkoutLogs = async (logs) => {
    try {
      await AsyncStorage.setItem('workoutLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving workout logs:', error);
    }
  };

  const saveTemplates = async (templates) => {
    try {
      await AsyncStorage.setItem('templates', JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving templates:', error);
    }
  };

  // Default exercises to choose from
  const defaultExercises = [
    'Bench Press',
    'Squats',
    'Deadlifts',
    'Overhead Press',
    'Barbell Rows',
    'Pull-ups',
    'Push-ups',
    'Lunges',
    'Bicep Curls',
    'Tricep Dips',
    'Planks',
    'Leg Press',
    'Lat Pulldowns',
    'Chest Flyes',
    'Shoulder Press',
  ];

  // Get current date info
  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const getDateKey = (day) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    return `${year}-${month}-${day}`;
  };

  const hasWorkout = (day) => {
    const dateKey = getDateKey(day);
    return workoutLogs[dateKey] && !workoutLogs[dateKey].isDraft;
  };

  const isDraftWorkout = (day) => {
    const dateKey = getDateKey(day);
    return workoutLogs[dateKey]?.isDraft;
  };

  const handleDatePress = (day) => {
    if (day) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
      // Clear workout state when changing dates
      setIsCreatingWorkout(false);
      setCurrentWorkout([]);
      setLastSaved(null);
    }
  };

  const addExercise = () => {
    if (!newExercise.name.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }
    
    // Validate sets and reps are positive numbers
    const sets = parseInt(newExercise.sets, 10);
    const reps = parseInt(newExercise.reps, 10);
    
    if (isNaN(sets) || sets <= 0) {
      Alert.alert('Error', 'Please enter a valid number of sets');
      return;
    }
    
    if (isNaN(reps) || reps <= 0) {
      Alert.alert('Error', 'Please enter a valid number of reps');
      return;
    }
    
    const exercise = {
      id: Date.now() + Math.random(), // Ensure unique ID
      name: newExercise.name.trim(),
      sets: sets,
      reps: reps,
      weight: newExercise.weight.trim() || 'Body Weight',
    };
    
    setCurrentWorkout(prev => [...prev, exercise]);
    setNewExercise({ name: '', sets: '3', reps: '10', weight: '' });
    setShowAddExercise(false);
    
    // Trigger auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      autoSaveWorkout();
    }, 2000);
    
    setAutoSaveTimeout(timeout);
  };

  const removeExercise = (exerciseId) => {
    setCurrentWorkout(prev => prev.filter(ex => ex.id !== exerciseId));
    
    // Trigger auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      autoSaveWorkout();
    }, 2000);
    
    setAutoSaveTimeout(timeout);
  };


  const moveExercise = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    setCurrentWorkout(prev => {
      const exercises = [...prev];
      const [movedExercise] = exercises.splice(fromIndex, 1);
      exercises.splice(toIndex, 0, movedExercise);
      return exercises;
    });
    
    // Trigger auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      autoSaveWorkout();
    }, 2000);
    
    setAutoSaveTimeout(timeout);
  };

  const DraggableExerciseItem = ({ exercise, index }) => {
    const pan = new Animated.ValueXY();
    
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        setDraggedIndex(index);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        setDraggedIndex(null);
        
        // Calculate new position based on gesture
        const moveDistance = gestureState.dy;
        const itemHeight = 80; // Approximate height of each item
        const newIndex = Math.round(index + moveDistance / itemHeight);
        
        if (newIndex >= 0 && newIndex < currentWorkout.length && newIndex !== index) {
          moveExercise(index, newIndex);
        }
        
        // Reset position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    });
    
    return (
      <Animated.View
        style={[
          styles.exerciseItem,
          draggedIndex === index && styles.draggedItem,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-three" size={20} color="#c7c7cc" />
          </View>
          <View style={styles.exerciseContent}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeExercise(exercise.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.exerciseFields}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Sets</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="3"
              value={exercise.sets}
              onChangeText={(text) => updateExerciseField(exercise.id, 'sets', text)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Reps</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="10"
              value={exercise.reps}
              onChangeText={(text) => updateExerciseField(exercise.id, 'reps', text)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Weight</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="135 lbs"
              value={exercise.weight}
              onChangeText={(text) => updateExerciseField(exercise.id, 'weight', text)}
            />
          </View>
        </View>
      </Animated.View>
    );
  };

  const saveWorkout = async () => {
    if (currentWorkout.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }
    
    // Validate that exercises have required fields
    const incompleteExercises = currentWorkout.filter(ex => !ex.sets || !ex.reps);
    if (incompleteExercises.length > 0) {
      Alert.alert('Error', 'Please fill in sets and reps for all exercises');
      return;
    }
    
    // Validate that sets and reps are positive numbers
    const invalidExercises = currentWorkout.filter(ex => {
      const sets = parseInt(ex.sets, 10);
      const reps = parseInt(ex.reps, 10);
      return isNaN(sets) || sets <= 0 || isNaN(reps) || reps <= 0;
    });
    
    if (invalidExercises.length > 0) {
      Alert.alert('Error', 'Please ensure all exercises have valid sets and reps (positive numbers)');
      return;
    }
    
    const dateKey = getDateKey(selectedDate.getDate());
    const completedWorkout = {
      id: Date.now(),
      exercises: currentWorkout.map(ex => ({
        ...ex,
        sets: parseInt(ex.sets, 10),
        reps: parseInt(ex.reps, 10),
        weight: ex.weight || 'Body Weight',
      })),
      notes: '',
      date: selectedDate.toISOString(),
      isDraft: false, // Mark as completed
      completedAt: new Date().toISOString(),
    };
    
    const updatedLogs = {
      ...workoutLogs,
      [dateKey]: completedWorkout,
    };
    
    setWorkoutLogs(updatedLogs);
    await saveWorkoutLogs(updatedLogs);
    
    setCurrentWorkout([]);
    setIsCreatingWorkout(false);
    
    // Clear auto-save timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }
    
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Workout saved! 🎉');
  };

  const deleteWorkout = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const dateKey = getDateKey(selectedDate.getDate());
            const updatedLogs = { ...workoutLogs };
            delete updatedLogs[dateKey];
            
            setWorkoutLogs(updatedLogs);
            await saveWorkoutLogs(updatedLogs);
            
            setCurrentWorkout([]);
            setIsCreatingWorkout(false);
            
            // Haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Success', 'Workout deleted');
          },
        },
      ]
    );
  };

  const saveAsTemplate = () => {
    if (currentWorkout.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }
    
    setTemplateName('');
    setShowCreateTemplate(true);
  };

  const createTemplate = async () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }
    
    const template = {
      id: Date.now(),
      name: templateName.trim(),
      exercises: currentWorkout.map(ex => ({ ...ex })),
      createdAt: new Date().toISOString(),
    };
    
    const updatedTemplates = {
      ...templates,
      [template.id]: template,
    };
    
    setTemplates(updatedTemplates);
    await saveTemplates(updatedTemplates);
    
    setShowCreateTemplate(false);
    setTemplateName('');
    
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Template saved successfully!');
  };

  const loadTemplate = (template) => {
    setCurrentWorkout(template.exercises.map(ex => ({ ...ex, id: Date.now() + Math.random() })));
    setIsCreatingWorkout(true);
    setShowTemplates(false);
    setLastSaved(null);
  };

  const deleteTemplate = (templateId) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const newTemplates = { ...templates };
            delete newTemplates[templateId];
            setTemplates(newTemplates);
            await saveTemplates(newTemplates);
            
            // Haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const startFromScratch = () => {
    setCurrentWorkout([]);
    setIsCreatingWorkout(true);
    setShowTemplates(false);
  };



  const startNewWorkout = () => {
    setCurrentWorkout([]);
    setIsCreatingWorkout(true);
    setLastSaved(null);
  };

  const addDefaultExercise = (exerciseName) => {
    const exercise = {
      id: Date.now() + Math.random(),
      name: exerciseName,
      sets: '',
      reps: '',
      weight: '',
    };
    
    setCurrentWorkout(prev => [...prev, exercise]);
    
    // Trigger auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      autoSaveWorkout();
    }, 2000);
    
    setAutoSaveTimeout(timeout);
  };

  const updateExerciseField = (exerciseId, field, value) => {
    setCurrentWorkout(prev => 
      prev.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, [field]: value }
          : ex
      )
    );
    
    // Auto-save after 2 seconds of inactivity
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      autoSaveWorkout();
    }, 2000);
    
    setAutoSaveTimeout(timeout);
    
    // Update last saved time to show user that changes are being tracked
    setLastSaved(new Date());
  };

  const autoSaveWorkout = async () => {
    if (currentWorkout.length === 0 || !isCreatingWorkout) return;
    
    try {
      const dateKey = getDateKey(selectedDate.getDate());
      const workoutData = {
        id: Date.now(),
        exercises: currentWorkout.map(ex => ({
          ...ex,
          sets: parseInt(ex.sets, 10) || 0,
          reps: parseInt(ex.reps, 10) || 0,
          weight: ex.weight || 'Body Weight',
        })),
        notes: '',
        date: selectedDate.toISOString(),
        isDraft: true, // Mark as draft for auto-saved workouts
      };
      
      const updatedLogs = {
        ...workoutLogs,
        [dateKey]: workoutData,
      };
      
      setWorkoutLogs(updatedLogs);
      await saveWorkoutLogs(updatedLogs);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error auto-saving workout:', error);
    }
  };

  // Handle navigation month changes
  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
    // Clear workout state when changing months
    setIsCreatingWorkout(false);
    setCurrentWorkout([]);
    setLastSaved(null);
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  const getDayName = (day) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };

  const selectedDateKey = getDateKey(selectedDate.getDate());
  const selectedWorkout = workoutLogs[selectedDateKey];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Log</Text>
          <Text style={styles.headerSubtitle}>Track your training sessions</Text>
          <View style={styles.headerPattern}>
            <View style={styles.patternLine} />
            <View style={[styles.patternLine, styles.patternLineShort]} />
            <View style={[styles.patternLine, styles.patternLineMedium]} />
          </View>
        </View>

        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.monthNavButton} 
            onPress={() => changeMonth('prev')}
          >
            <Ionicons name="chevron-back" size={20} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>
          <TouchableOpacity 
            style={styles.monthNavButton} 
            onPress={() => changeMonth('next')}
          >
            <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendar}>
          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.dayHeader}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar days */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  day && isToday(day) && styles.todayCell,
                  day && hasWorkout(day) && styles.workoutDayCell,
                  day && selectedDate.getDate() === day && styles.selectedCell,
                ]}
                onPress={() => handleDatePress(day)}
                disabled={!day}
              >
                {day && (
                  <>
                    <Text
                      style={[
                        styles.dayText,
                        isToday(day) && styles.todayText,
                        selectedDate.getDate() === day && styles.selectedText,
                      ]}
                    >
                      {day}
                    </Text>
                    {hasWorkout(day) && (
                      <View style={styles.workoutIndicator} />
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Date Info */}
        <View style={styles.selectedDateInfo}>
          <Text style={styles.selectedDateText}>
            {getDayName(selectedDate.getDay())}, {getMonthName(selectedDate.getMonth())} {selectedDate.getDate()}, {selectedDate.getFullYear()}
          </Text>
          {isToday(selectedDate.getDate()) && (
            <Text style={styles.todayLabel}>Today</Text>
          )}
        </View>

        {/* Workout Log/Plan */}
        <View style={styles.workoutSection}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>Workout Log</Text>
            {!selectedWorkout && !isCreatingWorkout && (
              <TouchableOpacity style={styles.addButton} onPress={startNewWorkout}>
                <Ionicons name="add" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={styles.addButtonText}>New Workout</Text>
              </TouchableOpacity>
            )}
            {isCreatingWorkout && (
              <View style={styles.workoutActionButtons}>
                <TouchableOpacity style={styles.saveWorkoutButton} onPress={saveWorkout}>
                  <Ionicons name="save" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                  <Text style={styles.saveWorkoutButtonText}>Save Workout</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedWorkout && !selectedWorkout.isDraft && (
              <View style={styles.workoutActionButtons}>
                <TouchableOpacity style={styles.addButton} onPress={startNewWorkout}>
                  <Ionicons name="add" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                  <Text style={styles.addButtonText}>New Workout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {selectedWorkout && !selectedWorkout.isDraft ? (
            <View style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutDate}>Workout Completed</Text>
                <TouchableOpacity 
                  style={styles.deleteWorkoutXButton} 
                  onPress={deleteWorkout}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              {selectedWorkout.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}
                  </Text>
                </View>
              ))}
              {selectedWorkout.notes && (
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{selectedWorkout.notes}</Text>
                </View>
              )}
            </View>
          ) : isCreatingWorkout ? (
            <View style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutDate}>Workout in Progress</Text>
                <TouchableOpacity 
                  style={styles.deleteWorkoutXButton} 
                  onPress={deleteWorkout}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>

              {/* Add Exercise Frame */}
                <TouchableOpacity 
                style={styles.addExerciseFrame}
                  onPress={() => setShowExerciseSelection(true)}
                activeOpacity={0.7}
                >
                <Ionicons name="add" size={32} color="#1a1a1a" />
                <Text style={styles.addExerciseFrameText}>add exercise</Text>
                </TouchableOpacity>

              {/* Current Exercises with Editable Fields */}
              {currentWorkout.map((exercise, index) => (
                <DraggableExerciseItem 
                  key={exercise.id} 
                  exercise={exercise} 
                  index={index} 
                />
              ))}
              
            </View>
          ) : (
            <View style={styles.noWorkoutCard}>
              <Text style={styles.noWorkoutText}>No workout logged for this day</Text>
              <Text style={styles.noWorkoutSubtext}>
                Tap "New Workout" to start logging your exercises
              </Text>
            </View>
          )}
        </View>
      </ScrollView>


      {/* Add Exercise Modal */}
      <Modal
        visible={showAddExercise}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddExercise(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Exercise name (e.g., Bench Press)"
              value={newExercise.name}
              onChangeText={(text) => setNewExercise(prev => ({ ...prev, name: text }))}
            />
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sets</Text>
                <TextInput
                  style={styles.numberInput}
                  placeholder="3"
                  value={newExercise.sets}
                  onChangeText={(text) => setNewExercise(prev => ({ ...prev, sets: text }))}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reps</Text>
                <TextInput
                  style={styles.numberInput}
                  placeholder="10"
                  value={newExercise.reps}
                  onChangeText={(text) => setNewExercise(prev => ({ ...prev, reps: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Weight (e.g., 135 lbs, Body Weight)"
              value={newExercise.weight}
              onChangeText={(text) => setNewExercise(prev => ({ ...prev, weight: text }))}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowAddExercise(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.addButton} onPress={addExercise}>
                <Text style={styles.addButtonText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Templates Modal */}
      <Modal
        visible={showTemplates}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTemplates(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Template</Text>
            
            <TouchableOpacity 
              style={[styles.templateOption, styles.startFromScratchOption]}
              onPress={() => {
                startFromScratch();
                setShowTemplates(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.templateOptionText, styles.startFromScratchText]}>Start from scratch</Text>
            </TouchableOpacity>
            
            {currentWorkout.length > 0 && (
              <TouchableOpacity 
                style={[styles.templateOption, styles.saveTemplateOption]}
                onPress={saveAsTemplate}
                activeOpacity={0.7}
              >
                <Ionicons name="save-outline" size={16} color="#1a1a1a" />
                <Text style={styles.templateOptionText}>Save current workout as template</Text>
              </TouchableOpacity>
            )}
            
            {Object.values(templates).length > 0 ? (
              <FlatList
                data={Object.values(templates)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.templateOptionContainer}>
                    <TouchableOpacity 
                      style={styles.templateOption}
                      onPress={() => loadTemplate(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.templateOptionText}>{item.name}</Text>
                      <Text style={styles.templateExerciseCount}>
                        {item.exercises.length} exercises
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteTemplateButton}
                      onPress={() => deleteTemplate(item.id)}
                    >
                      <Text style={styles.deleteTemplateButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noTemplatesText}>No templates saved yet</Text>
            )}
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowTemplates(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Template Modal */}
      <Modal
        visible={showCreateTemplate}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateTemplate(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Template</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter template name (e.g., 'Push Day', 'Leg Day')"
              value={templateName}
              onChangeText={setTemplateName}
              autoFocus={true}
            />
            
            <Text style={styles.templatePreviewTitle}>Template Preview:</Text>
            <View style={styles.templatePreview}>
              {currentWorkout.map((exercise, index) => (
                <Text key={index} style={styles.templatePreviewItem}>
                  • {exercise.name} ({exercise.sets || '?'} sets × {exercise.reps || '?'} reps)
                </Text>
              ))}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowCreateTemplate(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={createTemplate}
              >
                <Text style={styles.addButtonText}>Create Template</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Exercise Selection Modal */}
      <Modal
        visible={showExerciseSelection}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExerciseSelection(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.exerciseSelectionModal}>
            <View style={styles.exerciseSelectionHeader}>
              <Text style={styles.exerciseSelectionTitle}>Select Exercises</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowExerciseSelection(false)}
              >
                <Ionicons name="close" size={24} color="#8e8e93" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={defaultExercises}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseListItem}
                  onPress={() => {
                    addDefaultExercise(item);
                    setShowExerciseSelection(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.exerciseListItemText}>{item}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              style={styles.exerciseList}
            />
          </View>
        </View>
      </Modal>
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
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    fontWeight: '400',
  },
  headerPattern: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  patternLine: {
    width: 40,
    height: 2,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    borderRadius: 1,
  },
  patternLineShort: {
    width: 25,
  },
  patternLineMedium: {
    width: 30,
  },
  calendarHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  calendar: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    letterSpacing: -0.2,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 12,
    marginVertical: 2,
  },
  todayCell: {
    backgroundColor: '#1a1a1a',
  },
  workoutDayCell: {
    backgroundColor: '#f8f8f8',
  },
  selectedCell: {
    backgroundColor: '#1a1a1a',
  },
  dayText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  todayText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  workoutIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1a1a1a',
  },
  selectedDateInfo: {
    padding: 20,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: -0.2,
  },
  todayLabel: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
    marginTop: 4,
  },
  workoutSection: {
    margin: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  addButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: -0.2,
  },
  workoutActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f7',
  },
  saveWorkoutButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveWorkoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
    letterSpacing: -0.2,
    flex: 1,
  },
  deleteWorkoutXButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e7',
  },
  exerciseItem: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1a1a1a',
    letterSpacing: -0.2,
    flex: 1,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '400',
  },
  notesSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f7',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#8e8e93',
    fontStyle: 'italic',
  },
  noWorkoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 8,
    fontWeight: '500',
  },
  noWorkoutSubtext: {
    fontSize: 14,
    color: '#c7c7cc',
    textAlign: 'center',
    fontWeight: '400',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dragHandle: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  draggedItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addExerciseButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  addExerciseButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  saveActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveTemplateButton: {
    backgroundColor: '#8e8e93',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
  },
  saveTemplateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#f2f2f7',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#f2f2f7',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputGroup: {
    flex: 0.48,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#f2f2f7',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#8e8e93',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  templateOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  templateOption: {
    backgroundColor: '#fafafa',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    minHeight: 50,
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  deleteTemplateButton: {
    backgroundColor: '#8e8e93',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteTemplateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startFromScratchOption: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  startFromScratchText: {
    color: '#ffffff',
  },
  saveTemplateOption: {
    backgroundColor: '#f0f8ff',
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  templateExerciseCount: {
    fontSize: 14,
    color: '#8e8e93',
  },
  noTemplatesText: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  templatePreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 15,
    marginBottom: 10,
  },
  templatePreview: {
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    maxHeight: 150,
  },
  templatePreviewItem: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 5,
  },
  exerciseSelection: {
    marginBottom: 20,
  },
  exerciseSelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  exerciseScroll: {
    flexDirection: 'row',
  },
  exerciseChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  exerciseChipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  fieldGroup: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8e8e93',
    marginBottom: 6,
    textAlign: 'center',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#d1d1d6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  addWorkoutSection: {
    marginBottom: 20,
  },
  addExerciseFrame: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e7',
    borderStyle: 'dashed',
    width: '100%',
    marginBottom: 20,
  },
  addExerciseFrameText: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  addWorkoutButton: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e7',
    borderStyle: 'dashed',
    width: '100%',
  },
  addWorkoutButtonText: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  exerciseSelectionModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  exerciseSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  exerciseSelectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseList: {
    maxHeight: 400,
  },
  exerciseListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  exerciseListItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    letterSpacing: -0.2,
  },
});

