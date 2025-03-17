import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuthContext } from '../src/features/public/authentication/components';
import { colors } from '../src/theme';
import { UserType } from '../src/features/public/authentication/types';

export default function Index() {
  const { isAuthenticated, isInitialized, user } = useAuthContext();

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  // If not authenticated, go to login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Redirect based on user role
  if (user) {
    switch (user.userType) {
      case UserType.ADMIN:
        return <Redirect href="/admin" />;
      case UserType.TRAINER:
        return <Redirect href="/trainer" />;
      case UserType.STUDENT:
        return <Redirect href="/student" />;
      default:
        // Fallback to login if role is unknown
        return <Redirect href="/login" />;
    }
  }

  // Fallback if user data is not available
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
});
