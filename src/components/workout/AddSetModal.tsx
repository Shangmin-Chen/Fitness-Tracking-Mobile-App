import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Modal, Button } from '../ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

const AddSetModal = ({ 
  visible, 
  onClose, 
  newSet, 
  setNewSet, 
  onConfirm 
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Add Set"
    >
      <View style={styles.inputRow}>
        <TextInput
          style={styles.modalInput}
          placeholder="Reps"
          value={newSet.reps}
          onChangeText={text => setNewSet(prev => ({ ...prev, reps: text }))}
          keyboardType="numeric"
          autoFocus
        />
        <TextInput
          style={styles.modalInput}
          placeholder="Weight"
          value={newSet.weight}
          onChangeText={text => setNewSet(prev => ({ ...prev, weight: text }))}
        />
      </View>
      <View style={styles.modalActions}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onClose}
          style={styles.cancelButton}
        />
        <Button
          title="Add"
          variant="primary"
          onPress={onConfirm}
          style={styles.confirmButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    marginVertical: SPACING.lg,
  },
  modalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginHorizontal: SPACING.xs,
    ...TYPOGRAPHY.body,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  confirmButton: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
});

export default AddSetModal;
