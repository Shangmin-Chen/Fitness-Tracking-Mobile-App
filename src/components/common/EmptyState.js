import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

const EmptyState = ({ icon, title, subtitle, style }) => (
  <View style={[styles.emptyState, style]}>
    <Ionicons name={icon} size={48} color="#bdc3c7" />
    <Text style={styles.emptyStateText}>{title}</Text>
    {subtitle && <Text style={styles.emptyStateSubtext}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    letterSpacing: -0.2,
  },
  emptyStateSubtext: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.disabled,
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default EmptyState;
