import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  loading = false, 
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}` as keyof typeof styles]];
    
    if (disabled || loading) {
      baseStyle.push(styles.button_disabled);
    } else {
      baseStyle.push(styles[`button_${variant}` as keyof typeof styles]);
    }
    
    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`buttonText_${size}` as keyof typeof styles]];
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonText_disabled);
    } else {
      baseStyle.push(styles[`buttonText_${variant}` as keyof typeof styles]);
    }
    
    return [...baseStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle() as any}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? COLORS.surface : COLORS.text.primary} 
        />
      ) : (
        <>
          {icon && <Ionicons name={icon as any} size={16} color={variant === 'primary' ? COLORS.surface : COLORS.text.primary} style={styles.buttonIcon} />}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  button_small: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  button_medium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  button_large: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  button_primary: {
    backgroundColor: COLORS.info,
    borderColor: COLORS.info,
  },
  button_secondary: {
    backgroundColor: 'transparent',
    borderColor: COLORS.border,
  },
  button_success: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  button_danger: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  button_disabled: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.border,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
  },
  buttonText_small: {
    fontSize: 14,
  },
  buttonText_medium: {
    fontSize: 16,
  },
  buttonText_large: {
    fontSize: 18,
  },
  buttonText_primary: {
    color: COLORS.surface,
  },
  buttonText_secondary: {
    color: COLORS.text.primary,
  },
  buttonText_success: {
    color: COLORS.surface,
  },
  buttonText_danger: {
    color: COLORS.surface,
  },
  buttonText_disabled: {
    color: COLORS.text.disabled,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
});


export default Button;
