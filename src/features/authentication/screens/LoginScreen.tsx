import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, TextInput } from '../../../shared/components';
import { CpfInput } from '../components';
import { useAuthContext } from '../components/AuthProvider';
import { colors, spacing, typography } from '../../../theme';

const LoginScreen = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthContext();
  
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isCpfValid, setIsCpfValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isFormValid = isCpfValid && password.length >= 6;
  
  const handleLogin = async () => {
    if (!isFormValid) return;
    
    try {
      await login({ cpf, password });
      // Router will automatically redirect based on auth state
    } catch (error) {
      Alert.alert(
        'Erro ao fazer login',
        error instanceof Error ? error.message : 'Ocorreu um erro ao tentar fazer login. Tente novamente.',
      );
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/200x80?text=PhysiPro' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Entre com suas credenciais para acessar</Text>
          
          <View style={styles.inputContainer}>
            <CpfInput
              value={cpf}
              onChangeText={setCpf}
              onValidChange={setIsCpfValid}
            />
            
            <TextInput
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              isPassword
              secureTextEntry={!showPassword}
              startIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={colors.neutrals.darkGray}
                />
              }
            />
          </View>
          
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {
              // Navigate to forgot password screen
              Alert.alert('Funcionalidade', 'Recuperação de senha será implementada em breve.');
            }}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
          
          <Button
            title={isLoading ? 'Entrando...' : 'Entrar'}
            disabled={!isFormValid || isLoading}
            isLoading={isLoading}
            style={styles.loginButton}
            onPress={handleLogin}
          />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => {
                // Navigate to register screen
                Alert.alert('Funcionalidade', 'Cadastro será implementado em breve.');
              }}
            >
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 200,
    height: 80,
  },
  formContainer: {
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold as '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    color: colors.primary.default,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as '500',
  },
  loginButton: {
    marginBottom: spacing.xl,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  registerText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
  },
  registerLink: {
    color: colors.primary.default,
    fontWeight: typography.weights.semiBold as '600',
    fontSize: typography.sizes.md,
  },
});

export default LoginScreen; 