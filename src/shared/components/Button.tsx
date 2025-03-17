import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  StyleProp,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}) => {
  const getContainerStyles = (): StyleProp<ViewStyle> => {
    const baseStyles: StyleProp<ViewStyle>[] = [styles.container];
    
    // Add size styles
    if (size === 'small') baseStyles.push(styles.smallContainer);
    if (size === 'medium') baseStyles.push(styles.mediumContainer);
    if (size === 'large') baseStyles.push(styles.largeContainer);
    
    // Add variant styles
    if (variant === 'primary') baseStyles.push(styles.primaryContainer);
    if (variant === 'secondary') baseStyles.push(styles.secondaryContainer);
    if (variant === 'outline') baseStyles.push(styles.outlineContainer);
    if (variant === 'text') baseStyles.push(styles.textContainer);
    
    // Add disabled style
    if (disabled) baseStyles.push(styles.disabledContainer);
    
    // Add custom style
    if (style) baseStyles.push(style);
    
    return baseStyles;
  };
  
  const getTextStyles = (): StyleProp<TextStyle> => {
    const baseStyles: StyleProp<TextStyle>[] = [styles.text];
    
    // Add size styles
    if (size === 'small') baseStyles.push(styles.smallText);
    if (size === 'medium') baseStyles.push(styles.mediumText);
    if (size === 'large') baseStyles.push(styles.largeText);
    
    // Add variant styles
    if (variant === 'primary') baseStyles.push(styles.primaryText);
    if (variant === 'secondary') baseStyles.push(styles.secondaryText);
    if (variant === 'outline') baseStyles.push(styles.outlineText);
    if (variant === 'text') baseStyles.push(styles.textOnlyText);
    
    // Add disabled style
    if (disabled) baseStyles.push(styles.disabledText);
    
    // Add custom text style
    if (textStyle) baseStyles.push(textStyle);
    
    return baseStyles;
  };
  
  const getLoaderColor = () => {
    if (disabled) return colors.neutrals.mediumGray;
    if (variant === 'primary') return colors.neutrals.white;
    if (variant === 'secondary') return colors.neutrals.white;
    return colors.primary.default;
  };
  
  return (
    <TouchableOpacity
      style={getContainerStyles()}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={getLoaderColor()} size="small" />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryContainer: {
    backgroundColor: colors.primary.default,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary.default,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.default,
  },
  textContainer: {
    backgroundColor: 'transparent',
  },
  disabledContainer: {
    backgroundColor: colors.neutrals.gray,
    borderColor: colors.neutrals.gray,
  },
  smallContainer: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  mediumContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  largeContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },
  text: {
    fontFamily: typography.families.primary,
    fontWeight: typography.weights.medium as '500',
  },
  primaryText: {
    color: colors.neutrals.white,
  },
  secondaryText: {
    color: colors.neutrals.white,
  },
  outlineText: {
    color: colors.primary.default,
  },
  textOnlyText: {
    color: colors.primary.default,
  },
  disabledText: {
    color: colors.neutrals.darkGray,
  },
  smallText: {
    fontSize: typography.sizes.xs,
  },
  mediumText: {
    fontSize: typography.sizes.md,
  },
  largeText: {
    fontSize: typography.sizes.lg,
  },
});

export default Button; 