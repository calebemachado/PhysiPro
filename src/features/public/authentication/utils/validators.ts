/**
 * Validates a CPF (Brazilian individual taxpayer registry) number
 * 
 * @param cpf - The CPF to validate (can include formatting)
 * @returns boolean indicating if the CPF is valid
 */
export const isCpfValid = (cpf: string): boolean => {
  // Remove non-numeric characters
  const cleanCpf = cpf.replace(/\D/g, '');
  
  // Must have 11 digits
  if (cleanCpf.length !== 11) return false;
  
  // Check if all digits are the same (invalid but passes algorithm)
  if (/^(\d)\1+$/.test(cleanCpf)) return false;
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  
  let remainder = sum % 11;
  const firstCheckDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cleanCpf.charAt(9)) !== firstCheckDigit) return false;
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  
  remainder = sum % 11;
  const secondCheckDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cleanCpf.charAt(10)) === secondCheckDigit;
};

/**
 * Formats a CPF string with proper mask (XXX.XXX.XXX-XX)
 * 
 * @param cpf - The CPF to format (only numbers)
 * @returns formatted CPF string
 */
export const formatCpf = (cpf: string): string => {
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (cleanCpf.length <= 3) {
    return cleanCpf;
  } else if (cleanCpf.length <= 6) {
    return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3)}`;
  } else if (cleanCpf.length <= 9) {
    return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6)}`;
  } else {
    return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`;
  }
};

/**
 * Validates a password
 * 
 * @param password - The password to validate
 * @returns boolean indicating if the password is valid
 */
export const isPasswordValid = (password: string): boolean => {
  // Minimum 6 characters, at least one letter and one number
  return password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};

/**
 * Validates an email address
 * 
 * @param email - The email to validate
 * @returns boolean indicating if the email is valid
 */
export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}; 