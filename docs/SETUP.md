# Project Setup Guide

This guide will help you set up PhysiPro for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or newer)
- **npm** (v7 or newer) or **yarn** (v1.22 or newer)
- **Git**
- **Expo CLI** (`npm install -g expo-cli`)

For mobile development, you'll also need:

- **iOS**: Xcode (macOS only) and iOS Simulator
- **Android**: Android Studio and Android Emulator

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PhysiPro.git
cd PhysiPro
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory (optional for development):

```
# Example .env file
API_URL=https://your-api-url.com
```

Note: For local development, the app uses mock data by default.

### 4. Start the Development Server

```bash
# Using npm
npm start

# Using yarn
yarn start

# Using Expo CLI directly
expo start
```

This will start the Metro Bundler and show you a QR code.

### 5. Run on a Device/Emulator

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with the Expo Go app (available on App Store/Play Store)

## Development Tools Setup

### VS Code Extensions

We recommend the following VS Code extensions for a better development experience:

- ESLint
- Prettier
- React Native Tools
- TypeScript React code snippets

### Code Style Configuration

The project uses ESLint and Prettier for code formatting. To ensure your code follows the project standards:

```bash
# Using npm
npm run lint

# Using yarn
yarn lint
```

You can also set up format-on-save in VS Code by adding this to your settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Folder Structure

Make sure you understand the [architecture documentation](./ARCHITECTURE.md) to get familiar with the project structure.

## Troubleshooting

### Common Issues

#### Metro Bundler Not Starting

If the Metro Bundler doesn't start:

```bash
# Clear cache and restart
expo start -c
```

#### iOS Build Issues

For iOS build issues:

```bash
cd ios
pod install
cd ..
```

#### Node Module Errors

If you encounter node module errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Environment-Specific Configuration

### Development

Development environment uses:
- Mock data for authentication
- Debug logging enabled
- Hot reloading enabled

### Production

Production builds:
- Connect to actual API endpoints
- Disable debug logging
- Optimize for performance

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/docs/usage/) 