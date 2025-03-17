import { useEffect, useReducer, useState } from 'react';
import * as AuthService from '../services/auth-service';
import { AuthAction, AuthState, LoginCredentials } from '../types';

// Initial auth state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true, // Start with loading while we check if user is already logged in
  error: null,
  isAuthenticated: false,
};

// Auth reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if there's a saved token
        const isLoggedIn = await AuthService.isUserLoggedIn();
        
        if (isLoggedIn) {
          // If user is logged in, get user data and token in parallel
          const [user, token] = await Promise.all([
            AuthService.getSavedUser(),
            AuthService.getSavedToken()
          ]);
          
          if (user && token) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, token },
            });
          } else {
            // If we can't get user data or token, log out
            const clearSuccess = await AuthService.clearAuthData();
            if (!clearSuccess) {
              console.warn('Failed to clear auth data during authentication check');
            }
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Try to clear auth data on error
        try {
          await AuthService.clearAuthData();
        } catch (clearError) {
          console.error('Failed to clear auth data after auth check error:', clearError);
        }
        dispatch({ type: 'LOGOUT' });
      } finally {
        setIsInitialized(true);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const response = await AuthService.login(credentials);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response,
      });
      return response;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to login',
      });
      throw error;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      const success = await AuthService.logout();
      if (!success) {
        console.warn('Logout operation may not have completed successfully');
      }
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still dispatch logout action to update UI state
      dispatch({ type: 'LOGOUT' });
    }
  };
  
  return {
    ...state,
    isInitialized,
    login,
    logout,
  };
}; 