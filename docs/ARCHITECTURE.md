# Architecture Documentation

## Overview

PhysiPro is built using a feature-based architecture that clearly separates concerns between different parts of the application. The codebase is organized into modules according to functionality and access level, ensuring maintainability and scalability.

## Core Architectural Principles

1. **Feature-Based Structure**: Code is organized by features rather than technical layers
2. **Access-Level Separation**: Clear distinction between public and protected features
3. **Role-Based UI**: Different interfaces for different user types
4. **Modular and Reusable Components**: Encapsulated functionality with minimal dependencies

## Directory Structure

```
PhysiPro/
├── app/                 # Expo Router pages (file-based routing)
│   ├── _layout.tsx      # Root layout with navigation configuration
│   ├── index.tsx        # Entry point - redirects based on auth state
│   ├── login.tsx        # Login route
│   ├── admin/           # Admin routes
│   ├── trainer/         # Trainer routes
│   └── student/         # Student routes
├── src/
│   ├── features/        # Feature modules
│   │   ├── public/      # Publicly accessible features
│   │   │   └── authentication/ # Auth-related features
│   │   │       ├── components/ # Authentication-related components
│   │   │       ├── hooks/      # Auth hooks (useAuth, etc.)
│   │   │       ├── screens/    # Auth screens (Login, Register, etc.)
│   │   │       ├── services/   # Auth business logic and API integration
│   │   │       └── types/      # Auth-related TypeScript types
│   │   │
│   │   └── protected/  # Features requiring authentication
│   │       ├── admin/  # Admin-only features
│   │       ├── trainer/ # Trainer-only features
│   │       └── student/ # Student-only features
│   │
│   ├── navigation/     # Navigation-related components
│   │   └── AuthGuard.tsx # Access control component
│   │
│   ├── shared/         # Shared UI components and utilities
│   │   ├── components/ # Reusable UI components
│   │   └── hooks/      # Shared custom hooks
│   │
│   └── theme/          # Global styling themes
│       ├── colors.ts   # Color palette definitions
│       ├── spacing.ts  # Spacing constants
│       └── typography.ts # Typography definitions
│
├── assets/             # Static assets (images, fonts, etc.)
└── docs/               # Documentation files
```

## Key Components

### 1. Authentication Flow

The authentication flow is built using React Context for global state management:

- `AuthProvider`: Provides authentication state to the entire application
- `useAuth` hook: Manages authentication state and operations
- `AuthGuard`: Protects routes based on authentication status and user role

```
┌────────────────┐      ┌───────────────┐      ┌──────────────┐
│                │      │               │      │              │
│  Login Screen  │─────▶│  Auth Service │─────▶│ Auth Context │
│                │      │               │      │              │
└────────────────┘      └───────────────┘      └──────┬───────┘
                                                      │
                                                      ▼
┌────────────────┐      ┌───────────────┐      ┌──────────────┐
│                │      │               │      │              │
│   Protected    │◀─────│   AuthGuard   │◀─────│  Auth State  │
│    Routes      │      │               │      │              │
└────────────────┘      └───────────────┘      └──────────────┘
```

### 2. Role-Based Access

Access control is implemented at multiple levels:

- **Route Level**: The `AuthGuard` component in `app/_layout.tsx` protects routes
- **Navigation Level**: The `useProtectedRoute` hook manages role-based navigation
- **UI Level**: Each role has its dedicated screens and components

### 3. Data Flow

The application uses a unidirectional data flow pattern:

```
┌────────────────┐      ┌───────────────┐      ┌──────────────┐
│                │      │               │      │              │
│    Services    │─────▶│     Hooks     │─────▶│  Components  │
│ (API, Storage) │      │ (State Logic) │      │    (UI)      │
│                │      │               │      │              │
└────────────────┘      └───────────────┘      └──────────────┘
```

## State Management

The application uses React's Context API for global state management, divided into these primary contexts:

1. **AuthContext**: Manages user authentication state
   - Current user information
   - Authentication status
   - Login/logout operations

2. **Feature-specific contexts**: Each feature may have its own context for state management

## Navigation

The app uses Expo Router, a file-based routing system:

- Files in the `app/` folder automatically become routes
- Nested folders create nested routes
- The `_layout.tsx` files define the layout for each route group

## AsyncStorage Usage

AsyncStorage is used for persistent storage:

- Authentication tokens
- User preferences
- Cached data

The application implements a safe wrapper around AsyncStorage to handle errors and provide consistent interfaces.

## UI Architecture

The UI follows these principles:

1. **Component-Based**: UI is composed of reusable components
2. **Theme-Driven**: Global theme variables for colors, spacing, and typography
3. **Platform-Adaptive**: Adjusts for both iOS and Android

## Styling Approach

Styles are defined using React Native's StyleSheet API and organized by:

1. Component-specific styles defined within the component file
2. Global theme variables (colors, spacing, typography) imported from the theme module
3. Platform-specific styles using Platform.select()

## Error Handling

The application implements a multi-layer error handling strategy:

1. **Service Layer**: Try/catch blocks with specific error types
2. **Component Layer**: Error states and fallback UIs
3. **Global Error Boundary**: Catches unhandled errors

## Testing Strategy

The application is designed to be testable with:

1. **Unit Tests**: For isolated functionality and hooks
2. **Component Tests**: For UI components
3. **Integration Tests**: For feature workflows

## Future Architecture Considerations

Areas for potential architectural evolution:

1. **State Management**: Consider Redux/MobX for more complex state management as the app grows
2. **API Layer**: Implement a more robust API client with caching, retries, etc.
3. **Offline Support**: Enhance offline capabilities with a more sophisticated sync mechanism
4. **Performance Optimization**: Implement component memoization and virtualized lists for large datasets
