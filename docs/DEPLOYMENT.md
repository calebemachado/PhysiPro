# PhysiPro Deployment Guide

This document outlines the process for deploying the PhysiPro application to various environments, including development, staging, and production. Follow these guidelines to ensure smooth and consistent deployments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Expo Deployment](#expo-deployment)
4. [App Store Deployment](#app-store-deployment)
5. [Google Play Store Deployment](#google-play-store-deployment)
6. [CI/CD Setup](#cicd-setup)
7. [Rollback Procedures](#rollback-procedures)
8. [Monitoring](#monitoring)

## Prerequisites

Before deploying, ensure you have:

- Node.js (v16+) and npm (v7+) installed
- Expo CLI installed globally (`npm install -g expo-cli`)
- An [Expo](https://expo.dev/) account
- Apple Developer account (for iOS deployments)
- Google Play Developer account (for Android deployments)
- Access to the project's repository with appropriate permissions

## Environment Setup

PhysiPro uses environment-specific configuration files to manage different deployment targets:

### Environment Variables

Create environment-specific `.env` files:

- `.env.development` - Used for local development
- `.env.staging` - Used for test/QA deployments
- `.env.production` - Used for production deployments

Example `.env` file structure:

```
API_URL=https://api.physipro.com
ENVIRONMENT=production
```

### App Configuration

Update the `app.config.js` file to use the appropriate environment variables:

```javascript
export default ({ config }) => {
  // Get the environment from the process or use development as default
  const env = process.env.APP_ENV || 'development';
  
  // Load the appropriate .env file based on the environment
  require('dotenv').config({
    path: `.env.${env}`,
  });

  return {
    ...config,
    name: env === 'production' 
      ? 'PhysiPro' 
      : `PhysiPro (${env.toUpperCase()})`,
    slug: 'physipro',
    version: process.env.VERSION || '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: env === 'production' 
        ? 'com.yourcompany.physipro' 
        : `com.yourcompany.physipro.${env}`
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: env === 'production' 
        ? 'com.yourcompany.physipro' 
        : `com.yourcompany.physipro.${env}`
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      apiUrl: process.env.API_URL,
      environment: process.env.ENVIRONMENT,
    }
  };
};
```

## Expo Deployment

PhysiPro uses Expo for simplified deployment. Follow these steps to deploy to Expo:

### 1. Login to Expo

```bash
expo login
```

### 2. Configure the Project

Update the `app.json` file with your Expo account information:

```json
{
  "expo": {
    "owner": "your-expo-username"
  }
}
```

### 3. Build the App

#### Development Build (EAS)

For development and testing:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Configure EAS
eas build:configure

# Build for development
APP_ENV=development eas build --profile development --platform all
```

#### Production Build

For production releases:

```bash
# Clean and build the app
APP_ENV=production eas build --profile production --platform all
```

### 4. Publish to Expo

To publish your app to Expo's servers for over-the-air updates:

```bash
# Publish to a specific channel (e.g., staging or production)
APP_ENV=production expo publish --release-channel production
```

## App Store Deployment

To deploy to the Apple App Store:

### 1. Generate Build

```bash
eas build --platform ios --profile production
```

### 2. Submit to App Store

```bash
eas submit --platform ios
```

Alternatively, you can manually submit the build through App Store Connect:

1. Download the built IPA file from EAS
2. Use Transporter or App Store Connect to upload the build
3. Fill out all required metadata in App Store Connect
4. Submit for review

## Google Play Store Deployment

To deploy to the Google Play Store:

### 1. Generate Build

```bash
eas build --platform android --profile production
```

### 2. Submit to Play Store

```bash
eas submit --platform android
```

Alternatively, you can manually submit the build:

1. Download the AAB file from EAS
2. Login to the Google Play Console
3. Navigate to your app > Release management > App releases
4. Create a new release or update an existing track
5. Upload the AAB file
6. Fill out release notes and other information
7. Review and roll out

## CI/CD Setup

For automated deployments, we recommend using GitHub Actions. Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches:
      - main  # Production
      - develop  # Staging
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - development
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Install Expo CLI
        run: npm install -g expo-cli eas-cli

      - name: Login to Expo
        run: expo login -u ${{ secrets.EXPO_USERNAME }} -p ${{ secrets.EXPO_PASSWORD }}

      - name: Set environment
        id: set-env
        run: |
          if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
            echo "::set-output name=environment::${{ github.event.inputs.environment }}"
          elif [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "::set-output name=environment::production"
          elif [ "${{ github.ref }}" == "refs/heads/develop" ]; then
            echo "::set-output name=environment::staging"
          else
            echo "::set-output name=environment::development"
          fi

      - name: Build and publish
        run: |
          APP_ENV=${{ steps.set-env.outputs.environment }} expo publish --release-channel ${{ steps.set-env.outputs.environment }}

      - name: Build native apps (if needed)
        if: ${{ steps.set-env.outputs.environment == 'production' || steps.set-env.outputs.environment == 'staging' }}
        run: |
          APP_ENV=${{ steps.set-env.outputs.environment }} eas build --platform all --profile ${{ steps.set-env.outputs.environment }} --non-interactive
```

## Rollback Procedures

If you need to roll back to a previous version due to critical issues:

### Expo OTA Updates Rollback

```bash
# List published releases
expo publish:history

# Rollback to a specific publish
expo publish:rollback --release-channel production --sdk-version XX.X.X
```

### App Store Rollback

1. Go to App Store Connect > Your App > App Store > App Store Versions
2. Select the version you want to revert to
3. Click "Add to Review" and submit

### Google Play Store Rollback

1. Go to Google Play Console > Your App > Release management > App releases
2. Find the production track
3. Click "Manage" and then "Create new release"
4. Upload the previous APK or choose a previous build
5. Complete the release information and roll out

## Monitoring

After deployment, monitor the application's performance using:

### Expo Application Services (EAS)

- View real-time crash reports
- Monitor OTA update adoption
- Track user sessions

### App Store Connect Analytics

- Track downloads and usage
- Monitor crash reports
- Analyze user engagement

### Google Play Console Analytics

- View user acquisition data
- Monitor ANRs (Application Not Responding) and crashes
- Track user engagement

## Troubleshooting Common Deployment Issues

### OTA Updates Not Working

1. Verify the release channel is correct
2. Check that the app's SDK version matches the Expo SDK version
3. Ensure users have network connectivity

### Failed App Store Submission

1. Review rejection reasons in App Store Connect
2. Address privacy concerns (privacy policy, data usage, etc.)
3. Fix any reported crashes or performance issues

### Failed Google Play Submission

1. Check the Android Vitals in the Google Play Console
2. Address any policy violations mentioned in the rejection
3. Fix reported crashes or ANRs

By following this deployment guide, you should be able to successfully deploy PhysiPro to all target platforms and maintain a robust release process. 