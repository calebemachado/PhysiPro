import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuthContext } from '../src/features/authentication/components';
import { colors } from '../src/theme';

export default function Index() {
  const { isAuthenticated, isInitialized } = useAuthContext();

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  // Redirect based on authentication state
  return isAuthenticated ? <Redirect href="/home" /> : <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
});
