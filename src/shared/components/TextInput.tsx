import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isPassword?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helper,
  containerStyle,
  labelStyle,
  inputContainerStyle,
  inputStyle,
  helperStyle,
  errorStyle,
  startIcon,
  endIcon,
  isPassword = false,
  secureTextEntry,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const getInputContainerStyle = (): StyleProp<ViewStyle> => {
    const baseStyles: StyleProp<ViewStyle>[] = [styles.inputContainer];
    
    if (isFocused) {
      baseStyles.push(styles.inputContainerFocused);
    }
    
    if (error) {
      baseStyles.push(styles.inputContainerError);
    }
    
    if (inputContainerStyle) {
      baseStyles.push(inputContainerStyle);
    }
    
    return baseStyles;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderPasswordToggle = () => {
    if (!isPassword) return endIcon;
    
    return (
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
        <Ionicons
          name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color={colors.neutrals.darkGray}
        />
      </TouchableOpacity>
    );
  };

  // Create input style array with conditional styles
  const getInputStyle = (): StyleProp<TextStyle> => {
    const inputStyles: StyleProp<TextStyle>[] = [styles.input];
    
    if (startIcon) {
      inputStyles.push(styles.inputWithStartIcon);
    }
    
    if (endIcon || isPassword) {
      inputStyles.push(styles.inputWithEndIcon);
    }
    
    if (inputStyle) {
      inputStyles.push(inputStyle);
    }
    
    return inputStyles;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        {startIcon && <View style={styles.iconContainer}>{startIcon}</View>}
        
        <RNTextInput
          style={getInputStyle()}
          placeholderTextColor={colors.neutrals.mediumGray}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          {...rest}
        />
        
        {(endIcon || isPassword) && (
          <View style={styles.iconContainer}>
            {renderPasswordToggle()}
          </View>
        )}
      </View>
      
      {(helper || error) && (
        <Text
          style={[
            styles.helper,
            helper && !error && helperStyle,
            error && [styles.error, errorStyle],
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutrals.gray,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutrals.white,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: colors.primary.default,
  },
  inputContainerError: {
    borderColor: colors.feedback.error,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontFamily: typography.families.primary,
  },
  inputWithStartIcon: {
    paddingLeft: 0,
  },
  inputWithEndIcon: {
    paddingRight: 0,
  },
  iconContainer: {
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordToggle: {
    padding: spacing.xs,
  },
  helper: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  error: {
    color: colors.feedback.error,
  },
});

export default TextInput; 