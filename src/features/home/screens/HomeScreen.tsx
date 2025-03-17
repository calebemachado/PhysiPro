import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../../authentication/components/AuthProvider';
import { colors, spacing, typography } from '../../../theme';
import { Button } from '../../../shared/components';

const HomeScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  
  const handleLogout = async () => {
    await logout();
    // Router will automatically redirect based on auth state
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Olá,</Text>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          </View>
          
          <TouchableOpacity style={styles.profileContainer} onPress={() => {}}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={30} color={colors.neutrals.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Painel de Controle</Text>
          </View>
          
          <View style={styles.dashboardContainer}>
            <View style={styles.dashboardTile}>
              <Ionicons name="calendar" size={32} color={colors.primary.default} />
              <Text style={styles.tileTitle}>Agendamentos</Text>
              <Text style={styles.tileValue}>0</Text>
              <Text style={styles.tileSubtitle}>Próximos</Text>
            </View>
            
            <View style={styles.dashboardTile}>
              <Ionicons name="people" size={32} color={colors.primary.default} />
              <Text style={styles.tileTitle}>Alunos</Text>
              <Text style={styles.tileValue}>0</Text>
              <Text style={styles.tileSubtitle}>Ativos</Text>
            </View>
            
            <View style={styles.dashboardTile}>
              <Ionicons name="notifications" size={32} color={colors.primary.default} />
              <Text style={styles.tileTitle}>Notificações</Text>
              <Text style={styles.tileValue}>0</Text>
              <Text style={styles.tileSubtitle}>Não lidas</Text>
            </View>
          </View>
          
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Ações Rápidas</Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={24} color={colors.primary.default} />
              <Text style={styles.actionText}>Novo Agendamento</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person-add" size={24} color={colors.primary.default} />
              <Text style={styles.actionText}>Novo Aluno</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text" size={24} color={colors.primary.default} />
              <Text style={styles.actionText}>Registros</Text>
            </TouchableOpacity>
          </View>
          
          <Button
            title="Sair"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.default,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: typography.sizes.md,
    color: colors.neutrals.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
    color: colors.neutrals.white,
  },
  profileContainer: {
    marginLeft: spacing.md,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.neutrals.white,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.dark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.neutrals.white,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitleText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold as '600',
    color: colors.text.primary,
  },
  dashboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  dashboardTile: {
    flex: 1,
    backgroundColor: colors.neutrals.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginHorizontal: spacing.xs / 2,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.neutrals.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tileTitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  tileValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold as '700',
    color: colors.text.primary,
  },
  tileSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  actionsContainer: {
    backgroundColor: colors.neutrals.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.neutrals.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutrals.gray,
  },
  actionText: {
    marginLeft: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  logoutButton: {
    marginTop: spacing.xl,
  },
});

export default HomeScreen; 