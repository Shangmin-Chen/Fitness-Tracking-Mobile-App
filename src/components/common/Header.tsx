import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';
import { HeaderProps } from '../../types';

const Header: React.FC<HeaderProps> = ({ title, subtitle, pattern, style }) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle} accessibilityRole="text">
            {subtitle}
          </Text>
        )}
      </View>
      {pattern && <View style={styles.headerPattern}>{pattern}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: SPACING.xxxl,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  headerPattern: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.xl,
    zIndex: 1,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontWeight: '400',
  },
});


export default Header;
