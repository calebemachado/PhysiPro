# Feature Implementation Guide

This document provides a step-by-step guide on how to implement new features in the PhysiPro application. Following these guidelines will ensure consistent code organization and implementation patterns across the project.

## Table of Contents

1. [Feature Implementation Process](#feature-implementation-process)
2. [Detailed Implementation Steps](#detailed-implementation-steps)
3. [Example: Implementing a Notification Feature](#example-implementing-a-notification-feature)
4. [Testing Guidelines](#testing-guidelines)
5. [Common Pitfalls](#common-pitfalls)

## Feature Implementation Process

Here's an overview of the process for adding a new feature:

1. Analyze requirements and determine feature scope
2. Identify where the feature belongs (public or protected)
3. Define the feature's data models (types/interfaces)
4. Implement service layer
5. Create UI components
6. Add navigation/routing
7. Implement tests
8. Document the feature

## Detailed Implementation Steps

### Step 1: Feature Analysis and Planning

Before writing any code, take time to:

- **Define Feature Scope**: Clearly define what the feature will and won't do
- **Identify User Roles**: Determine which user types (admin, trainer, student) will access the feature
- **Sketch UI/UX**: Create a rough sketch of the user interface
- **Identify Data Requirements**: Define what data the feature will need and how it will be managed

### Step 2: Create Feature Module Structure

Based on your analysis, create the appropriate directory structure:

```bash
# For a protected feature only accessible to authenticated users
mkdir -p src/features/protected/<feature-name>/components
mkdir -p src/features/protected/<feature-name>/screens
mkdir -p src/features/protected/<feature-name>/services
mkdir -p src/features/protected/<feature-name>/hooks
mkdir -p src/features/protected/<feature-name>/types

# Or for a public feature accessible to all users
mkdir -p src/features/public/<feature-name>/components
mkdir -p src/features/public/<feature-name>/screens
mkdir -p src/features/public/<feature-name>/services
mkdir -p src/features/public/<feature-name>/hooks
mkdir -p src/features/public/<feature-name>/types
```

### Step 3: Define Types and Interfaces

Create the necessary types in the `types` directory:

```typescript
// src/features/protected/<feature-name>/types/index.ts

export interface MyFeatureData {
  id: string;
  name: string;
  // other properties...
}

export interface MyFeatureState {
  isLoading: boolean;
  data: MyFeatureData[] | null;
  error: string | null;
}

export type MyFeatureAction =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_SUCCESS'; payload: MyFeatureData[] }
  | { type: 'FETCH_FAILURE'; payload: string };
```

### Step 4: Implement Service Layer

Create services that handle data fetching, processing, and storage:

```typescript
// src/features/protected/<feature-name>/services/<feature-name>-service.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyFeatureData } from '../types';

const STORAGE_KEY = '@PhysiPro:<feature-name>';

export const fetchData = async (): Promise<MyFeatureData[]> => {
  try {
    // API call or AsyncStorage operation
    const response = await fetch('api/endpoint');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Other service functions...
```

### Step 5: Create Custom Hooks

Build hooks that encapsulate the feature's business logic:

```typescript
// src/features/protected/<feature-name>/hooks/use<FeatureName>.ts

import { useReducer, useEffect } from 'react';
import * as FeatureService from '../services/<feature-name>-service';
import { MyFeatureState, MyFeatureAction } from '../types';

const initialState: MyFeatureState = {
  isLoading: false,
  data: null,
  error: null,
};

const reducer = (state: MyFeatureState, action: MyFeatureAction): MyFeatureState => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const use<FeatureName> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const data = await FeatureService.fetchData();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  };

  // Other functions that manipulate state...

  return {
    ...state,
    fetchData,
    // other functions...
  };
};
```

### Step 6: Create UI Components

Create reusable components specific to your feature:

```typescript
// src/features/protected/<feature-name>/components/<ComponentName>.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../../theme';
import { MyFeatureData } from '../types';

interface <ComponentName>Props {
  item: MyFeatureData;
  onPress?: (item: MyFeatureData) => void;
}

export const <ComponentName>: React.FC<<ComponentName>Props> = ({ item, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      {/* Other UI elements */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background.light,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
  },
  // Other styles...
});
```

### Step 7: Build Feature Screens

Create the main screens for your feature:

```typescript
// src/features/protected/<feature-name>/screens/<FeatureName>Screen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../../../theme';
import { use<FeatureName> } from '../hooks/use<FeatureName>';
import { <ComponentName> } from '../components/<ComponentName>';

export const <FeatureName>Screen: React.FC = () => {
  const router = useRouter();
  const { isLoading, data, error, fetchData } = use<FeatureName>();

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}><FeatureName></Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <<ComponentName> 
            item={item} 
            onPress={() => router.push(`/<feature-name>/${item.id}`)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background.light,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.feedback.error,
    fontSize: typography.sizes.md,
  },
});

export default <FeatureName>Screen;
```

### Step 8: Create Index Export File

Create an index file to export all components and screens:

```typescript
// src/features/protected/<feature-name>/screens/index.ts

export { default as <FeatureName>Screen } from './<FeatureName>Screen';
// Export other screens...

// src/features/protected/<feature-name>/components/index.ts

export { <ComponentName> } from './<ComponentName>';
// Export other components...
```

### Step 9: Add Routing

Add routes in the app directory:

```typescript
// app/<feature-name>/index.tsx

import React from 'react';
import { <FeatureName>Screen } from '../../src/features/protected/<feature-name>/screens';

export default function <FeatureName>Index() {
  return <<FeatureName>Screen />;
}

// app/<feature-name>/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';

export default function <FeatureName>Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: '<Feature Name>',
      }}
    />
  );
}

// For detail views: app/<feature-name>/[id].tsx

import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { <FeatureName>DetailScreen } from '../../src/features/protected/<feature-name>/screens';

export default function <FeatureName>Detail() {
  const { id } = useLocalSearchParams();
  return <<FeatureName>DetailScreen id={id as string} />;
}
```

### Step 10: Update Navigation (if needed)

If the feature requires a new navigation item, update the appropriate files:

- For bottom tab navigation, update the tab navigator configuration
- For role-specific features, update the appropriate role's layout file

### Step 11: Testing

Create tests for your feature components, hooks, and services.

## Example: Implementing a Notification Feature

Let's walk through a concrete example of implementing a notification feature for trainers:

### 1. Create Directory Structure

```bash
mkdir -p src/features/protected/notifications/components
mkdir -p src/features/protected/notifications/screens
mkdir -p src/features/protected/notifications/services
mkdir -p src/features/protected/notifications/hooks
mkdir -p src/features/protected/notifications/types
```

### 2. Define Types

```typescript
// src/features/protected/notifications/types/index.ts

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'appointment' | 'system' | 'message';
}

export interface NotificationsState {
  isLoading: boolean;
  notifications: Notification[] | null;
  error: string | null;
}

export type NotificationsAction =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_SUCCESS'; payload: Notification[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string };
```

### 3. Create Service

```typescript
// src/features/protected/notifications/services/notifications-service.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '../types';

const NOTIFICATIONS_KEY = '@PhysiPro:notifications';

// Mock data - replace with actual API calls
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Appointment',
    message: 'You have a new appointment scheduled for tomorrow at 10:00 AM',
    read: false,
    createdAt: new Date().toISOString(),
    type: 'appointment',
  },
  // More mock notifications...
];

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    // In a real app, this would be an API call
    // For now, we'll use AsyncStorage with mock data
    const storedNotifications = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    
    if (!storedNotifications) {
      // If no stored notifications, save and return mock data
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(mockNotifications));
      return mockNotifications;
    }
    
    return JSON.parse(storedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const storedNotifications = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    
    if (!storedNotifications) {
      return false;
    }
    
    const notifications: Notification[] = JSON.parse(storedNotifications);
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};
```

### 4. Create Custom Hook

```typescript
// src/features/protected/notifications/hooks/useNotifications.ts

import { useReducer, useEffect } from 'react';
import * as NotificationsService from '../services/notifications-service';
import { NotificationsState, NotificationsAction, Notification } from '../types';

const initialState: NotificationsState = {
  isLoading: false,
  notifications: null,
  error: null,
};

const reducer = (state: NotificationsState, action: NotificationsAction): NotificationsState => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, notifications: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'MARK_AS_READ':
      if (!state.notifications) return state;
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    default:
      return state;
  }
};

export const useNotifications = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchNotifications = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const notifications = await NotificationsService.fetchNotifications();
      dispatch({ type: 'FETCH_SUCCESS', payload: notifications });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    const success = await NotificationsService.markAsRead(notificationId);
    if (success) {
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    }
  };

  const getUnreadCount = (): number => {
    if (!state.notifications) return 0;
    return state.notifications.filter(n => !n.read).length;
  };

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    getUnreadCount,
  };
};
```

### 5. Create Components

```typescript
// src/features/protected/notifications/components/NotificationItem.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../../theme';
import { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const getIconName = () => {
    switch (notification.type) {
      case 'appointment':
        return 'calendar';
      case 'system':
        return 'information-circle';
      case 'message':
        return 'chatbubble';
      default:
        return 'notifications';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity 
      style={[styles.container, !notification.read && styles.unread]} 
      onPress={() => onPress(notification)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName()} size={24} color={colors.primary.default} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
        <Text style={styles.date}>{formatDate(notification.createdAt)}</Text>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.neutrals.white,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unread: {
    borderLeftColor: colors.primary.default,
    backgroundColor: colors.neutrals.lightGray,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.default,
    alignSelf: 'center',
  },
});
```

### 6. Create Screen

```typescript
// src/features/protected/notifications/screens/NotificationsScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../../../theme';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from '../components/NotificationItem';
import { Notification } from '../types';

export const NotificationsScreen: React.FC = () => {
  const router = useRouter();
  const { isLoading, notifications, error, fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    // In a real app, you might navigate to different screens based on notification type
    // For now, we'll just mark it as read
  };

  if (isLoading && !notifications) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem 
            notification={item} 
            onPress={handleNotificationPress}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={fetchNotifications} 
            colors={[colors.primary.default]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background.light,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.feedback.error,
    fontSize: typography.sizes.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
});

export default NotificationsScreen;
```

### 7. Create Index Export

```typescript
// src/features/protected/notifications/screens/index.ts

export { default as NotificationsScreen } from './NotificationsScreen';

// src/features/protected/notifications/components/index.ts

export { NotificationItem } from './NotificationItem';
```

### 8. Add Routing

```typescript
// app/notifications/index.tsx

import React from 'react';
import { NotificationsScreen } from '../../src/features/protected/notifications/screens';

export default function NotificationsIndex() {
  return <NotificationsScreen />;
}

// app/notifications/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: 'Notifications',
      }}
    />
  );
}
```

## Testing Guidelines

When implementing a new feature, write tests for:

1. **Service Functions**: Test API calls, data transformation, and storage interactions
2. **Custom Hooks**: Test state changes and business logic
3. **Components**: Test rendering and user interactions
4. **Integration**: Test the entire feature workflow

## Common Pitfalls

- **Lack of Error Handling**: Always handle potential errors in async operations
- **Inconsistent Styling**: Use theme variables for consistent look and feel
- **Tightly Coupled Components**: Keep components modular and reusable
- **Direct State Mutations**: Always use immutable patterns to update state
- **Missing Loading States**: Handle loading states to provide feedback to users
- **Hardcoded Strings**: Use constants or configuration files for strings
- **Inadequate TypeScript Types**: Define comprehensive types for better type safety
- **Forgetting to Clean Up Effects**: Always clean up subscriptions in useEffect

By following this guide, you'll maintain a consistent, maintainable, and scalable codebase as you add new features to the PhysiPro application. 