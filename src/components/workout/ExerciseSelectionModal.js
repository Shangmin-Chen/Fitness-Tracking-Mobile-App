import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Modal } from '../ui';
import { DEFAULT_EXERCISES } from '../../constants';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

const ExerciseSelectionModal = ({ 
  visible, 
  onClose, 
  onSelectExercise 
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Select Exercise"
    >
      <FlatList
        data={DEFAULT_EXERCISES}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseOption}
            onPress={() => onSelectExercise(item)}
          >
            <Text style={styles.exerciseOptionText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  exerciseOption: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  exerciseOptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
});

export default ExerciseSelectionModal;
