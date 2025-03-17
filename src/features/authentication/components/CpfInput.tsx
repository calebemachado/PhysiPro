import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from '../../../shared/components';
import { formatCpf, isCpfValid } from '../utils/validators';
import { colors } from '../../../theme';

interface CpfInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  onValidChange?: (isValid: boolean) => void;
}

const CpfInput: React.FC<CpfInputProps> = ({
  value,
  onChangeText,
  error,
  onValidChange,
}) => {
  const [isTouched, setIsTouched] = useState(false);
  
  const handleChangeText = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/\D/g, '');
    
    // Format the CPF
    const formattedCpf = formatCpf(numericValue);
    
    // Update the value
    onChangeText(formattedCpf);
    
    // Validate CPF if length is 14 (fully formatted CPF)
    if (formattedCpf.length === 14) {
      const isValid = isCpfValid(formattedCpf);
      onValidChange?.(isValid);
    } else if (onValidChange) {
      onValidChange(false);
    }
  };
  
  const handleBlur = () => {
    setIsTouched(true);
    
    // Validate on blur if we have a value
    if (value && onValidChange) {
      const isValid = isCpfValid(value);
      onValidChange(isValid);
    }
  };
  
  // Determine the error message to display
  const displayError = error || (isTouched && value.length > 0 && value.length < 14 
    ? 'CPF incompleto' 
    : (isTouched && value.length === 14 && !isCpfValid(value) 
      ? 'CPF inválido' 
      : undefined));
  
  return (
    <TextInput
      label="CPF"
      placeholder="123.456.789-10"
      keyboardType="numeric"
      value={value}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      error={displayError}
      maxLength={14}
      startIcon={
        <Ionicons
          name="person-outline"
          size={24}
          color={colors.neutrals.darkGray}
        />
      }
    />
  );
};

export default CpfInput; 