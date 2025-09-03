import React, { useState } from 'react';
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
} from 'react-native';

export default function LogScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutLogs, setWorkoutLogs] = useState({});
  const [templates, setTemplates] = useState({});
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '3',
    reps: '10',
    weight: '',
  });

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

  const hasWorkout = (day) => {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    return workoutLogs[dateKey];
  };

  const handleDatePress = (day) => {
    if (day) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    }
  };

  const addExercise = () => {
    if (!newExercise.name.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }
    
    const exercise = {
      id: Date.now(),
      name: newExercise.name.trim(),
      sets: parseInt(newExercise.sets) || 3,
      reps: parseInt(newExercise.reps) || 10,
      weight: newExercise.weight.trim() || 'Body Weight',
    };
    
    setCurrentWorkout(prev => [...prev, exercise]);
    setNewExercise({ name: '', sets: '3', reps: '10', weight: '' });
    setShowAddExercise(false);
  };

  const removeExercise = (exerciseId) => {
    setCurrentWorkout(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const saveWorkout = () => {
    if (currentWorkout.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }
    
    const dateKey = `${currentYear}-${currentMonth + 1}-${selectedDate.getDate()}`;
    const newWorkout = {
      id: Date.now(),
      exercises: currentWorkout,
      notes: '',
      date: selectedDate.toISOString(),
    };
    
    setWorkoutLogs(prev => ({
      ...prev,
      [dateKey]: newWorkout,
    }));
    
    setCurrentWorkout([]);
    Alert.alert('Success', 'Workout saved successfully!');
  };

  const saveAsTemplate = () => {
    if (currentWorkout.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }
    
    Alert.prompt(
      'Save Template',
      'Enter a name for this workout template:',
      (templateName) => {
        if (templateName && templateName.trim()) {
          const template = {
            id: Date.now(),
            name: templateName.trim(),
            exercises: currentWorkout,
            createdAt: new Date().toISOString(),
          };
          
          setTemplates(prev => ({
            ...prev,
            [template.id]: template,
          }));
          
          Alert.alert('Success', 'Template saved successfully!');
        }
      }
    );
  };

  const loadTemplate = (template) => {
    setCurrentWorkout(template.exercises.map(ex => ({ ...ex, id: Date.now() + Math.random() })));
    setShowTemplates(false);
  };

  const startNewWorkout = () => {
    setCurrentWorkout([]);
    setShowTemplates(true);
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

  const selectedDateKey = `${currentYear}-${currentMonth + 1}-${selectedDate.getDate()}`;
  const selectedWorkout = workoutLogs[selectedDateKey];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <Text style={styles.monthYear}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>
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
                    {hasWorkout(day) && <View style={styles.workoutIndicator} />}
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
            {!selectedWorkout && (
              <TouchableOpacity style={styles.addButton} onPress={startNewWorkout}>
                <Text style={styles.addButtonText}>+ New Workout</Text>
              </TouchableOpacity>
            )}
          </View>

          {selectedWorkout ? (
            <View style={styles.workoutCard}>
              <Text style={styles.workoutDate}>Workout Completed</Text>
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
          ) : currentWorkout.length > 0 ? (
            <View style={styles.workoutCard}>
              <Text style={styles.workoutDate}>Building Workout</Text>
              {currentWorkout.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseItem}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeExercise(exercise.id)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}
                  </Text>
                </View>
              ))}
              
              <View style={styles.workoutActions}>
                <TouchableOpacity style={styles.addExerciseButton} onPress={() => setShowAddExercise(true)}>
                  <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
                </TouchableOpacity>
                
                <View style={styles.saveActions}>
                  <TouchableOpacity style={styles.saveTemplateButton} onPress={saveAsTemplate}>
                    <Text style={styles.saveTemplateButtonText}>Save as Template</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.saveWorkoutButton} onPress={saveWorkout}>
                    <Text style={styles.saveWorkoutButtonText}>Save Workout</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
              style={styles.templateOption}
              onPress={() => {
                setCurrentWorkout([]);
                setShowTemplates(false);
              }}
            >
              <Text style={styles.templateOptionText}>Start from scratch</Text>
            </TouchableOpacity>
            
            {Object.values(templates).length > 0 ? (
              <FlatList
                data={Object.values(templates)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.templateOption}
                    onPress={() => loadTemplate(item)}
                  >
                    <Text style={styles.templateOptionText}>{item.name}</Text>
                    <Text style={styles.templateExerciseCount}>
                      {item.exercises.length} exercises
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noTemplatesText}>No templates saved yet</Text>
            )}
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowTemplates(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  calendarHeader: {
    padding: 20,
    alignItems: 'center',
  },
  monthYear: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  calendar: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
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
  },
  todayCell: {
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  workoutDayCell: {
    backgroundColor: '#e8f5e8',
  },
  selectedCell: {
    backgroundColor: '#f39c12',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  workoutIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27ae60',
  },
  selectedDateInfo: {
    padding: 20,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  todayLabel: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
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
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 15,
  },
  exerciseItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  notesSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  noWorkoutCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  noWorkoutSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutActions: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  addExerciseButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addExerciseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  saveActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveTemplateButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  saveTemplateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  saveWorkoutButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  saveWorkoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
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
    color: '#2c3e50',
    marginBottom: 5,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  templateOption: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  templateOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  templateExerciseCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  noTemplatesText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});
