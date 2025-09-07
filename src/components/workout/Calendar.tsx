import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MONTHS, DAYS } from '../../constants';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import { generateCalendarDays, isToday } from '../../utils';

const Calendar = ({ 
  selectedDate, 
  onDateSelect, 
  onMonthChange, 
  workoutLogs 
}) => {
  const calendarDays = generateCalendarDays(selectedDate);

  return (
    <View style={styles.calendar}>
      <View style={styles.dayHeaders}>
        {DAYS.map(day => (
          <Text key={day} style={styles.dayHeader}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarDays.map((day, i) => {
          const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${day}`;
          const hasWorkout = day && workoutLogs[dateKey];
          const isSelected = day === selectedDate.getDate();
          const isTodayDate = day && isToday(day, selectedDate);

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.dayCell,
                day && isTodayDate && styles.todayCell,
                day && hasWorkout && styles.workoutDayCell,
                isSelected && styles.selectedCell,
              ]}
              onPress={() => day && onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
              disabled={!day}
            >
              {day && (
                <>
                  <Text style={[
                    styles.dayText,
                    isTodayDate && styles.todayText,
                    isSelected && styles.selectedText,
                  ]}>
                    {day}
                  </Text>
                  {hasWorkout && <View style={styles.workoutIndicator} />}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    borderRadius: 10,
    padding: SPACING.sm,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
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
    padding: SPACING.xs,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  todayCell: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
  },
  todayText: {
    color: COLORS.info,
    fontWeight: '600',
  },
  selectedCell: {
    backgroundColor: COLORS.info,
    borderRadius: 20,
  },
  selectedText: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  workoutDayCell: {
    borderWidth: 2,
    borderColor: COLORS.success,
    borderRadius: 20,
  },
  workoutIndicator: {
    width: 4,
    height: 4,
    backgroundColor: COLORS.success,
    borderRadius: 2,
    position: 'absolute',
    bottom: 2,
  },
});

export default Calendar;
