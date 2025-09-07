import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

const Button = ({ 
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
    const baseStyle = [styles.button, styles[`button_${size}`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.button_disabled);
    } else {
      baseStyle.push(styles[`button_${variant}`]);
    }
    
    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`buttonText_${size}`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonText_disabled);
    } else {
      baseStyle.push(styles[`buttonText_${variant}`]);
    }
    
    return [...baseStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
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
          {icon && <Ionicons name={icon} size={16} color={getTextStyle().color} style={styles.buttonIcon} />}
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

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  accessibilityLabel: PropTypes.string,
  testID: PropTypes.string,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  icon: null,
  loading: false,
  disabled: false,
  style: null,
  textStyle: null,
  accessibilityLabel: null,
  testID: null,
};

export default Button;
