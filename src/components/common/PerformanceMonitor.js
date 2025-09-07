import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

/**
 * Performance monitoring component for development
 * Shows render count and performance metrics
 */
const PerformanceMonitor = ({ componentName, enabled = __DEV__ }) => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(Date.now());

  useEffect(() => {
    if (!enabled) return;

    setRenderCount(prev => prev + 1);
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime;
    
    console.log(`[Performance] ${componentName} rendered ${renderCount + 1} times. Time since last render: ${timeSinceLastRender}ms`);
    
    setLastRenderTime(now);
  });

  if (!enabled) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {componentName}: {renderCount} renders
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: SPACING.xs,
    borderRadius: 4,
    zIndex: 9999,
  },
  text: {
    color: COLORS.surface,
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default PerformanceMonitor;
