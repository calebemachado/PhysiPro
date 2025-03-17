import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Redirect, usePathname, useRouter, useSegments } from 'expo-router';
import { useAuthContext } from '../features/public/authentication/components/AuthProvider';
import { colors } from '../theme';
import { UserType } from '../features/public/authentication/types';

// Define which routes can be accessed by authenticated users
const PUBLIC_ROUTES = ['login', 'register', 'forgot-password'];

// Define screens where the header should be hidden
const HEADER_HIDDEN_ROUTES = ['login', 'register', 'forgot-password'];

// Define role-based routes
const ROLE_ROUTES = {
  [UserType.ADMIN]: 'admin',
  [UserType.TRAINER]: 'trainer',
  [UserType.STUDENT]: 'student',
};

export const useProtectedRoute = () => {
  const { isAuthenticated, isInitialized, isLoading, user } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();
  const currentRoute = pathname.substring(1); // Remove the leading slash
  
  // Get the first segment to determine which module (admin, trainer, student) is being accessed
  const currentModule = segments[0] || '';

  useEffect(() => {
    if (!isInitialized) return;

    const inPublicRoute = PUBLIC_ROUTES.includes(currentRoute);
    const inProtectedRoute = !inPublicRoute;

    if (inProtectedRoute && !isAuthenticated) {
      // Redirect to login if user is not authenticated and trying to access protected route
      router.replace('/login');
    } else if (inPublicRoute && isAuthenticated && user) {
      // Redirect to appropriate role-based home screen if user is authenticated and trying to access public route
      const userRoleRoute = ROLE_ROUTES[user.userType];
      router.replace(`/${userRoleRoute}` as any);
    } else if (isAuthenticated && user && currentModule && currentModule !== ROLE_ROUTES[user.userType]) {
      // Redirect to the appropriate module based on user role if they're trying to access the wrong module
      // Only enforce this if they are in a known module path (admin, trainer, student)
      const isKnownModule = Object.values(ROLE_ROUTES).includes(currentModule);
      if (isKnownModule) {
        const correctRoute = ROLE_ROUTES[user.userType];
        router.replace(`/${correctRoute}` as any);
      }
    }
  }, [isAuthenticated, isInitialized, pathname, router, currentRoute, user, currentModule]);

  return { 
    shouldHideHeader: HEADER_HIDDEN_ROUTES.includes(currentRoute),
    isLoading: isLoading || !isInitialized,
    userType: user?.userType,
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