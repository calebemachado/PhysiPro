import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Redirect, usePathname, useRouter, useSegments } from 'expo-router';
import { useAuthContext } from '../features/authentication/components/AuthProvider';
import { colors } from '../theme';

// Define which routes can be accessed by authenticated users
const PUBLIC_ROUTES = ['login', 'register', 'forgot-password'];

// Define screens where the header should be hidden
const HEADER_HIDDEN_ROUTES = ['login', 'register', 'forgot-password'];

export const useProtectedRoute = () => {
  const { isAuthenticated, isInitialized, isLoading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();
  const currentRoute = pathname.substring(1); // Remove the leading slash

  useEffect(() => {
    if (!isInitialized) return;

    const inPublicRoute = PUBLIC_ROUTES.includes(currentRoute);
    const inProtectedRoute = !inPublicRoute;

    if (inProtectedRoute && !isAuthenticated) {
      // Redirect to login if user is not authenticated and trying to access protected route
      router.replace('/login');
    } else if (inPublicRoute && isAuthenticated) {
      // Redirect to home if user is authenticated and trying to access public route
      router.replace('/home');
    }
  }, [isAuthenticated, isInitialized, pathname, router, currentRoute]);

  return { 
    shouldHideHeader: HEADER_HIDDEN_ROUTES.includes(currentRoute),
    isLoading: isLoading || !isInitialized,
  };
};

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
});

export default AuthGuard; 