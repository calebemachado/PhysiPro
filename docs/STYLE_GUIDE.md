# Style Guide

This document outlines the coding conventions and style guidelines for the PhysiPro project.

## TypeScript Guidelines

### Basic Principles

- Use English for all code and documentation.
- Always declare the type of each variable and function (parameters and return value).
  - Avoid using `any` as much as possible.
  - Create necessary interfaces and types.
- Use JSDoc to document public classes and methods.
- Avoid blank lines within a function.
- One export per file for main components/functions.

### Naming Conventions

- **PascalCase** for:
  - Components
  - Interfaces
  - Type aliases
  - Enums
  - Classes

- **camelCase** for:
  - Variables
  - Functions
  - Methods
  - Properties

- **UPPERCASE_WITH_UNDERSCORES** for:
  - Constants
  - Environment variables

- **kebab-case** for:
  - File and directory names

### Function Guidelines

- Write short functions with a single purpose. Aim for less than 20 statements.
- Name functions with a verb followed by a descriptive noun:
  - If it returns a boolean, use `isX` or `hasX`, `canX`, etc.
  - If it doesn't return anything, use `executeX` or `saveX`, etc.
- Avoid nested code blocks by:
  - Using early returns
  - Extracting to utility functions
- Use higher-order functions (map, filter, reduce, etc.) to avoid for-loops.
  - Use arrow functions for simple functions
  - Use named functions for more complex operations
- Use default parameter values instead of checking for null or undefined.
- Prefer object destructuring for function parameters.

## React Guidelines

### Components

- One component per file
- Use functional components with hooks
- Keep components small and focused
- Break down complex components into smaller ones
- Follow this structure for component files:
  1. Imports
  2. Types/Interfaces
  3. Component definition
  4. Styles
  5. Export

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // Component logic

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background.light,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyComponent;
```

### Hooks

- Follow the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)
- Use custom hooks to share logic between components
- Name custom hooks with the `use` prefix (e.g., `useAuth`, `useForm`)
- Keep dependency arrays accurate in `useEffect`, `useMemo`, and `useCallback`

## Styling Guidelines

### StyleSheet Use

- Always use `StyleSheet.create()` for styles, not inline objects
- Group related styles together
- Use descriptive style names that reflect purpose, not appearance
- Leverage the theme variables for consistency

### Theme Usage

- Import theme variables from the theme module:
  ```typescript
  import { colors, spacing, typography } from '../theme';
  ```
- Use theme values instead of hardcoded values:
  ```typescript
  // Good
  color: colors.primary.default,
  padding: spacing.md,
  fontSize: typography.sizes.md,
  
  // Bad
  color: '#007AFF',
  padding: 16,
  fontSize: 16,
  ```

### Responsive Design

- Use relative units rather than fixed dimensions when possible
- Use `Platform.select()` for platform-specific styling
- Consider different screen sizes in your layout

## File Organization

### Directory Structure

- Keep related files together in the same directory
- Use index files for exporting multiple components from a directory
- Group files by feature, not by type

### Import Order

1. React/React Native imports
2. Third-party libraries
3. Custom components/hooks
4. Utilities/services
5. Types/interfaces
6. Assets

## Comments and Documentation

- Use JSDoc comments for public functions and components
- Write comments to explain "why", not "what"
- Keep comments up to date
- Use TODO comments for temporary solutions, but address them promptly

## Error Handling

- Use try/catch blocks around async operations
- Provide meaningful error messages
- Handle errors at the appropriate level
- Use a consistent error handling pattern

## Testing

- Write tests for all components and business logic
- Follow the AAA pattern (Arrange, Act, Assert)
- Use descriptive test names
- Mock external dependencies

## Performance Considerations

- Use `React.memo` for components that render often but with the same props
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions passed to child components
- Avoid unnecessary re-renders

## AsyncStorage Guidelines

- Use descriptive keys with a namespace prefix (e.g., '@PhysiPro:authToken')
- Handle errors during AsyncStorage operations
- Consider creating a wrapper around AsyncStorage for consistent error handling
- Store minimal data in AsyncStorage
- Parse/stringify JSON properly 