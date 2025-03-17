import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/features/authentication/components';
import AuthGuard from '../src/navigation/AuthGuard';
import { View, ActivityIndicator, StyleSheet, Platform, Text } from 'react-native';
import { colors } from '../src/theme';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the splash screen visible while we initialize
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Ignore errors as they just mean the splash screen has already been hidden */
});

// Test AsyncStorage accessibility
const testAsyncStorage = async (): Promise<boolean> => {
  const TEST_KEY = '@PhysiPro:test';
  try {
    // Try to set and get a test key
    await AsyncStorage.setItem(TEST_KEY, 'test');
    const value = await AsyncStorage.getItem(TEST_KEY);
    
    // Clean up test key regardless of result
    await AsyncStorage.removeItem(TEST_KEY);
    
    return value === 'test';
  } catch (error) {
    console.error('AsyncStorage test failed:', error);
    
    // Try to clean up even on error
    try {
      await AsyncStorage.removeItem(TEST_KEY);
    } catch {
      // Ignore cleanup errors
    }
    
    return false;
  }
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [asyncStorageError, setAsyncStorageError] = useState(false);
  
  useEffect(() => {
    // Prepare the app
    async function prepare() {
      try {
        // Test if AsyncStorage is accessible
        const asyncStorageWorks = await testAsyncStorage();
        if (!asyncStorageWorks) {
          setAsyncStorageError(true);
          console.error('AsyncStorage test failed. AsyncStorage might not be working properly.');
        }
        
        // Wait for a moment to ensure AsyncStorage is fully initialized
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error during app preparation:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        
        // Hide the splash screen
        SplashScreen.hideAsync().catch(console.warn);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }
  
  if (asyncStorageError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Storage Error</Text>
        <Text style={styles.errorMessage}>
          There was a problem initializing the app's storage.{'\n'}
          Please try restarting the app or reinstalling it.
        </Text>
        <Text style={styles.errorDetail}>
          Error: AsyncStorage failed initialization test
        </Text>
      </View>
    );
  }
  
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </AuthGuard>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background.light,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.feedback.error,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text.primary,
  },
  errorDetail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
