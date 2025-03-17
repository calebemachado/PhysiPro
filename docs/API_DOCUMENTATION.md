# API Documentation

This document outlines the data structures, storage patterns, and mock API implementations used in the PhysiPro application. While the app currently uses local storage via AsyncStorage for data persistence, this documentation will help prepare for future integration with a proper backend API.

## Table of Contents

1. [Data Storage Overview](#data-storage-overview)
2. [Auth API](#auth-api)
3. [User Profiles API](#user-profiles-api)
4. [Admin Module API](#admin-module-api)
5. [Trainer Module API](#trainer-module-api)
6. [Student Module API](#student-module-api)
7. [Error Handling](#error-handling)
8. [Future API Integration](#future-api-integration)

## Data Storage Overview

The PhysiPro application currently uses AsyncStorage for local data persistence. Key naming follows a consistent pattern for easy organization and retrieval:

```
@PhysiPro:<module>:<entity>
```

For example:
- `@PhysiPro:auth:user` - Stores the current authenticated user
- `@PhysiPro:admin:users` - Stores the list of all users (for admin access)
- `@PhysiPro:trainer:students` - Stores the list of students assigned to a trainer

## Auth API

### Data Structures

```typescript
// User roles
export type UserRole = 'admin' | 'trainer' | 'student';

// User authentication data
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string; // JWT token (for future implementation)
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
```

### Mock API Functions

```typescript
// Local storage key
const AUTH_USER_KEY = '@PhysiPro:auth:user';

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
  try {
    // This would be an API call in a real application
    // For now, we use mock data with a delay to simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation (replace with actual API call)
    if (credentials.email === 'admin@physipro.com' && credentials.password === 'password') {
      const user: AuthUser = { 
        id: '1', 
        email: credentials.email, 
        name: 'Admin User', 
        role: 'admin' 
      };
      
      // Store user in AsyncStorage
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    if (credentials.email === 'trainer@physipro.com' && credentials.password === 'password') {
      const user: AuthUser = { 
        id: '2', 
        email: credentials.email, 
        name: 'Trainer User', 
        role: 'trainer' 
      };
      
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    if (credentials.email === 'student@physipro.com' && credentials.password === 'password') {
      const user: AuthUser = { 
        id: '3', 
        email: credentials.email, 
        name: 'Student User', 
        role: 'student' 
      };
      
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const userData = await AsyncStorage.getItem(AUTH_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Register user
export const register = async (data: RegistrationData): Promise<AuthUser> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, this would be handled by the backend
    const newUser: AuthUser = {
      id: Math.random().toString(36).substring(2, 9), // Generate a random ID
      email: data.email,
      name: data.name,
      role: data.role,
    };
    
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
```

## User Profiles API

### Data Structures

```typescript
export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  specializations?: string[]; // For trainers
  medicalHistory?: string; // For students
  dateOfBirth?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
```

### Mock API Functions

```typescript
const USER_PROFILES_KEY = '@PhysiPro:profiles';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const profilesData = await AsyncStorage.getItem(USER_PROFILES_KEY);
    const profiles: UserProfile[] = profilesData ? JSON.parse(profilesData) : [];
    
    return profiles.find(profile => profile.userId === userId) || null;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};

export const updateUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    const profilesData = await AsyncStorage.getItem(USER_PROFILES_KEY);
    let profiles: UserProfile[] = profilesData ? JSON.parse(profilesData) : [];
    
    const existingProfileIndex = profiles.findIndex(p => p.userId === profile.userId);
    
    const updatedProfile = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    
    if (existingProfileIndex !== -1) {
      profiles[existingProfileIndex] = updatedProfile;
    } else {
      profiles.push({
        ...updatedProfile,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString()
      });
    }
    
    await AsyncStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles));
    return updatedProfile;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};
```

## Admin Module API

### Data Structures

```typescript
export interface AdminDashboardStats {
  totalUsers: number;
  activeTrainers: number;
  activeStudents: number;
  newUsersThisMonth: number;
}

export interface User extends AuthUser {
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'pending';
}
```

### Mock API Functions

```typescript
const ADMIN_USERS_KEY = '@PhysiPro:admin:users';

// Get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersData = await AsyncStorage.getItem(ADMIN_USERS_KEY);
    
    if (!usersData) {
      // Initialize with mock data if empty
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@physipro.com',
          name: 'Admin User',
          role: 'admin',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          email: 'trainer@physipro.com',
          name: 'Trainer User',
          role: 'trainer',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '3',
          email: 'student@physipro.com',
          name: 'Student User',
          role: 'student',
          createdAt: new Date().toISOString(),
          status: 'active'
        }
      ];
      
      await AsyncStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(mockUsers));
      return mockUsers;
    }
    
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

// Create a new user (admin only)
export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  try {
    const usersData = await AsyncStorage.getItem(ADMIN_USERS_KEY);
    const users: User[] = usersData ? JSON.parse(usersData) : [];
    
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await AsyncStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
    
    return newUser;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// Update user status (admin only)
export const updateUserStatus = async (userId: string, status: User['status']): Promise<User> => {
  try {
    const usersData = await AsyncStorage.getItem(ADMIN_USERS_KEY);
    
    if (!usersData) {
      throw new Error('Users data not found');
    }
    
    const users: User[] = JSON.parse(usersData);
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex] = {
      ...users[userIndex],
      status
    };
    
    await AsyncStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
    return users[userIndex];
  } catch (error) {
    console.error('Update user status error:', error);
    throw error;
  }
};

// Get dashboard stats (admin only)
export const getDashboardStats = async (): Promise<AdminDashboardStats> => {
  try {
    const usersData = await AsyncStorage.getItem(ADMIN_USERS_KEY);
    
    if (!usersData) {
      return {
        totalUsers: 0,
        activeTrainers: 0,
        activeStudents: 0,
        newUsersThisMonth: 0
      };
    }
    
    const users: User[] = JSON.parse(usersData);
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    return {
      totalUsers: users.length,
      activeTrainers: users.filter(user => user.role === 'trainer' && user.status === 'active').length,
      activeStudents: users.filter(user => user.role === 'student' && user.status === 'active').length,
      newUsersThisMonth: users.filter(user => new Date(user.createdAt) >= firstDayOfMonth).length
    };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};
```

## Trainer Module API

### Data Structures

```typescript
export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  progress: number; // 0-100%
  lastSession?: string; // ISO date string
}

export interface TrainerDashboardStats {
  activeStudents: number;
  sessionsThisWeek: number;
  averageStudentProgress: number;
  upcomingSessions: number;
}

export interface Session {
  id: string;
  trainerId: string;
  studentId: string;
  date: string; // ISO date string
  duration: number; // minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  completed: boolean;
}
```

### Mock API Functions

```typescript
const TRAINER_STUDENTS_KEY = '@PhysiPro:trainer:students';
const TRAINER_SESSIONS_KEY = '@PhysiPro:trainer:sessions';

// Get students for a trainer
export const getTrainerStudents = async (trainerId: string): Promise<Student[]> => {
  try {
    const studentsData = await AsyncStorage.getItem(TRAINER_STUDENTS_KEY);
    
    if (!studentsData) {
      // Initialize with mock data
      const mockStudents: Record<string, Student[]> = {
        '2': [
          {
            id: '3',
            name: 'Student User',
            email: 'student@physipro.com',
            status: 'active',
            progress: 65,
            lastSession: new Date().toISOString()
          },
          // Add more mock students as needed
        ]
      };
      
      await AsyncStorage.setItem(TRAINER_STUDENTS_KEY, JSON.stringify(mockStudents));
      return mockStudents[trainerId] || [];
    }
    
    const allStudents: Record<string, Student[]> = JSON.parse(studentsData);
    return allStudents[trainerId] || [];
  } catch (error) {
    console.error('Get trainer students error:', error);
    throw error;
  }
};

// Get sessions for a trainer
export const getTrainerSessions = async (trainerId: string): Promise<Session[]> => {
  try {
    const sessionsData = await AsyncStorage.getItem(TRAINER_SESSIONS_KEY);
    
    if (!sessionsData) {
      // Initialize with mock data
      const mockSessions: Session[] = [
        {
          id: '1',
          trainerId: '2',
          studentId: '3',
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          duration: 60,
          status: 'scheduled',
          exercises: [
            {
              id: '1',
              name: 'Shoulder Press',
              description: 'Lift weights above head',
              sets: 3,
              reps: 10,
              completed: false
            }
          ]
        }
      ];
      
      await AsyncStorage.setItem(TRAINER_SESSIONS_KEY, JSON.stringify(mockSessions));
      return mockSessions.filter(session => session.trainerId === trainerId);
    }
    
    const allSessions: Session[] = JSON.parse(sessionsData);
    return allSessions.filter(session => session.trainerId === trainerId);
  } catch (error) {
    console.error('Get trainer sessions error:', error);
    throw error;
  }
};

// Schedule a new session
export const scheduleSession = async (session: Omit<Session, 'id'>): Promise<Session> => {
  try {
    const sessionsData = await AsyncStorage.getItem(TRAINER_SESSIONS_KEY);
    const sessions: Session[] = sessionsData ? JSON.parse(sessionsData) : [];
    
    const newSession: Session = {
      ...session,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    sessions.push(newSession);
    await AsyncStorage.setItem(TRAINER_SESSIONS_KEY, JSON.stringify(sessions));
    
    return newSession;
  } catch (error) {
    console.error('Schedule session error:', error);
    throw error;
  }
};

// Get trainer dashboard stats
export const getTrainerDashboardStats = async (trainerId: string): Promise<TrainerDashboardStats> => {
  try {
    const students = await getTrainerStudents(trainerId);
    const sessions = await getTrainerSessions(trainerId);
    
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const sessionsThisWeek = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek && sessionDate <= currentDate && session.status === 'completed';
    });
    
    const upcomingSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate > currentDate && session.status === 'scheduled';
    });
    
    const activeStudents = students.filter(student => student.status === 'active');
    const totalProgress = activeStudents.reduce((sum, student) => sum + student.progress, 0);
    
    return {
      activeStudents: activeStudents.length,
      sessionsThisWeek: sessionsThisWeek.length,
      averageStudentProgress: activeStudents.length > 0 ? totalProgress / activeStudents.length : 0,
      upcomingSessions: upcomingSessions.length
    };
  } catch (error) {
    console.error('Get trainer dashboard stats error:', error);
    throw error;
  }
};
```

## Student Module API

### Data Structures

```typescript
export interface StudentDashboardStats {
  progress: number;
  completedSessions: number;
  upcomingSessions: number;
  totalExercises: number;
}

export interface StudentProfile extends UserProfile {
  trainer?: {
    id: string;
    name: string;
    email: string;
  };
  medicalNotes?: string;
  goals?: string[];
}

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  sessionsCompleted: number;
  improvementRate: number; // Percentage improvement
  lastCompleted?: string; // ISO date string
}
```

### Mock API Functions

```typescript
const STUDENT_PROFILE_KEY = '@PhysiPro:student:profile';
const STUDENT_EXERCISES_KEY = '@PhysiPro:student:exercises';

// Get student profile
export const getStudentProfile = async (studentId: string): Promise<StudentProfile | null> => {
  try {
    const profileData = await AsyncStorage.getItem(`${STUDENT_PROFILE_KEY}:${studentId}`);
    
    if (!profileData) {
      // Initialize with mock data for demo purposes
      if (studentId === '3') {
        const mockProfile: StudentProfile = {
          id: '3',
          userId: '3',
          name: 'Student User',
          email: 'student@physipro.com',
          role: 'student',
          trainer: {
            id: '2',
            name: 'Trainer User',
            email: 'trainer@physipro.com'
          },
          medicalNotes: 'Previous shoulder injury',
          goals: ['Improve mobility', 'Strengthen core'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await AsyncStorage.setItem(`${STUDENT_PROFILE_KEY}:${studentId}`, JSON.stringify(mockProfile));
        return mockProfile;
      }
      return null;
    }
    
    return JSON.parse(profileData);
  } catch (error) {
    console.error('Get student profile error:', error);
    return null;
  }
};

// Get student sessions
export const getStudentSessions = async (studentId: string): Promise<Session[]> => {
  try {
    const sessionsData = await AsyncStorage.getItem(TRAINER_SESSIONS_KEY);
    
    if (!sessionsData) {
      return [];
    }
    
    const allSessions: Session[] = JSON.parse(sessionsData);
    return allSessions.filter(session => session.studentId === studentId);
  } catch (error) {
    console.error('Get student sessions error:', error);
    throw error;
  }
};

// Get student exercise progress
export const getStudentExerciseProgress = async (studentId: string): Promise<ExerciseProgress[]> => {
  try {
    const progressData = await AsyncStorage.getItem(`${STUDENT_EXERCISES_KEY}:${studentId}`);
    
    if (!progressData) {
      // Mock data for demo
      const mockProgress: ExerciseProgress[] = [
        {
          exerciseId: '1',
          exerciseName: 'Shoulder Press',
          sessionsCompleted: 8,
          improvementRate: 15,
          lastCompleted: new Date().toISOString()
        },
        {
          exerciseId: '2',
          exerciseName: 'Squat',
          sessionsCompleted: 12,
          improvementRate: 25,
          lastCompleted: new Date().toISOString()
        }
      ];
      
      await AsyncStorage.setItem(`${STUDENT_EXERCISES_KEY}:${studentId}`, JSON.stringify(mockProgress));
      return mockProgress;
    }
    
    return JSON.parse(progressData);
  } catch (error) {
    console.error('Get student exercise progress error:', error);
    throw error;
  }
};

// Get student dashboard stats
export const getStudentDashboardStats = async (studentId: string): Promise<StudentDashboardStats> => {
  try {
    const sessions = await getStudentSessions(studentId);
    const exercises = await getStudentExerciseProgress(studentId);
    
    const completedSessions = sessions.filter(session => session.status === 'completed').length;
    const upcomingSessions = sessions.filter(session => {
      return session.status === 'scheduled' && new Date(session.date) > new Date();
    }).length;
    
    // Calculate overall progress (in a real app, this would be more sophisticated)
    const progress = exercises.reduce((total, ex) => total + ex.improvementRate, 0) / 
      (exercises.length || 1);
    
    return {
      progress,
      completedSessions,
      upcomingSessions,
      totalExercises: exercises.length
    };
  } catch (error) {
    console.error('Get student dashboard stats error:', error);
    throw error;
  }
};
```

## Error Handling

All API functions include error handling with proper console logging. In a production environment, these errors should be:

1. Logged to a monitoring service
2. Structured for consistent handling throughout the app
3. Categorized by type (network, validation, authentication, etc.)

Common error handling pattern used throughout the API:

```typescript
try {
  // API operation
} catch (error) {
  console.error('Operation name error:', error);
  
  // Determine error type and structure appropriate response
  if (error instanceof NetworkError) {
    throw new Error('A network error occurred. Please check your connection.');
  } else if (error instanceof ValidationError) {
    throw new Error(`Validation error: ${error.message}`);
  } else {
    throw new Error('An unexpected error occurred. Please try again later.');
  }
}
```

## Future API Integration

When migrating from AsyncStorage to a real backend API, follow these steps:

1. Create an API client using axios or fetch with appropriate interceptors
2. Update service functions to call backend endpoints instead of AsyncStorage
3. Implement proper authentication with JWT tokens
4. Add request/response caching for performance improvement
5. Implement offline support with sync capabilities

Example API client structure:

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API client class
export class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        const token = await AsyncStorage.getItem('@PhysiPro:auth:token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Handle token refresh if needed
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Refresh token logic
            const refreshToken = await AsyncStorage.getItem('@PhysiPro:auth:refreshToken');
            // Call refresh token endpoint
            // Update tokens in storage
            
            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Handle refresh failure (logout user)
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(baseURL: string): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(baseURL);
    }
    return ApiClient.instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Usage example:
// const api = ApiClient.getInstance('https://api.physipro.com/v1');
// const users = await api.get<User[]>('/users');
```

This structure sets the foundation for a smooth transition to a backend API when the application is ready to scale beyond local storage. 