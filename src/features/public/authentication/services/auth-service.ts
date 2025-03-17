import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, LoginResponse, User, UserType } from '../types';

// Storage keys
const AUTH_TOKEN_KEY = '@PhysiPro:authToken';
const USER_DATA_KEY = '@PhysiPro:userData';

/**
 * Safely executes AsyncStorage operations with error handling
 */
const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error retrieving ${key} from AsyncStorage:`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error storing ${key} in AsyncStorage:`, error);
      return false;
    }
  },
  multiSet: async (keyValuePairs: [string, string][]): Promise<boolean> => {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
      return true;
    } catch (error) {
      console.error(`Error storing multiple keys in AsyncStorage:`, error);
      return false;
    }
  },
  multiRemove: async (keys: string[]): Promise<boolean> => {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error(`Error removing keys from AsyncStorage:`, error);
      return false;
    }
  }
};

/**
 * Mock login function - simulates API call
 * In a real application, this would make a network request
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // For development/demo, we'll simulate a network request delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate validation - in a real app this would be done on the server
  if (credentials.cpf === '123.456.789-10' && credentials.password === 'password123') {
    // Mock successful response
    const response: LoginResponse = {
      user: {
        id: '1',
        name: 'Treinador',
        userType: UserType.TRAINER,
        cpf: '123.456.789-10',
        email: 'john@example.com',
        profileImage: 'https://via.placeholder.com/150',
      },
      token: 'mock-jwt-token-would-be-here',
    };

    // Save auth data to storage
    await saveAuthData(response);

    return response;
  } else {
    // Simulate error
    throw new Error('CPF ou senha inválidos.');
  }
};

/**
 * Mock logout function
 */
export const logout = async (): Promise<boolean> => {
  // In a real app, you might need to invalidate the token on the server
  return await clearAuthData();
};

/**
 * Save authentication data to persistent storage
 * Uses multiSet to ensure both values are stored atomically
 */
export const saveAuthData = async (data: LoginResponse): Promise<boolean> => {
  const keyValuePairs: [string, string][] = [
    [AUTH_TOKEN_KEY, data.token],
    [USER_DATA_KEY, JSON.stringify(data.user)]
  ];
  
  return await safeStorage.multiSet(keyValuePairs);
};

/**
 * Get saved user data from storage
 */
export const getSavedUser = async (): Promise<User | null> => {
  const userData = await safeStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Get saved auth token from storage
 */
export const getSavedToken = async (): Promise<string | null> => {
  return await safeStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is already logged in
 */
export const isUserLoggedIn = async (): Promise<boolean> => {
  const token = await getSavedToken();
  return !!token;
};

/**
 * Clear all authentication data from storage
 */
export const clearAuthData = async (): Promise<boolean> => {
  return await safeStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
}; 