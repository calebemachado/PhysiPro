# PhysiPro

PhysiPro is a mobile application designed for physiotherapists, trainers, and their clients to manage rehabilitation programs, track progress, and enhance communication.

## Tech Stack

- React Native with Expo
- TypeScript
- Expo Router for navigation
- React Context API for state management
- AsyncStorage for local data persistence
- Ionicons for UI icons

## Features

- Role-based access control (Admin, Trainer, Student)
- Authentication and authorization
- Customized dashboards for different user roles
- Profile management
- Responsive design for different screen sizes

## Project Structure

This project follows a modular architecture organized by feature access and domain:

```
PhysiPro/
├── app/                       # Expo Router entry points
├── src/
│   ├── features/              # Feature modules
│   │   ├── public/            # Features accessible to all users
│   │   │   └── authentication/ # Authentication feature
│   │   └── protected/         # Features requiring authentication
│   │       ├── admin/         # Admin features
│   │       ├── trainer/       # Trainer features
│   │       └── student/       # Student features
│   ├── navigation/            # Navigation components
│   └── theme/                 # Theme configuration
└── docs/                      # Project documentation
```

The `src/features` directory contains all feature modules organized by access level (public/protected) and then by domain. Each feature module has its own set of components, screens, services, and utilities.

## Documentation

We maintain comprehensive documentation to help you understand, use, and contribute to the project:

- [Architecture Documentation](docs/ARCHITECTURE.md) - Overview of the system design and architectural decisions
- [Project Setup Guide](docs/SETUP.md) - Instructions for setting up the development environment
- [Feature Implementation Guide](docs/FEATURE_IMPLEMENTATION.md) - Step-by-step guide for implementing new features
- [Style Guide](docs/STYLE_GUIDE.md) - Coding standards and style conventions
- [API Documentation](docs/API_DOCUMENTATION.md) - Information about the API and data structures
- [Deployment Guide](docs/DEPLOYMENT.md) - Instructions for deploying the application
- [Contributing Guide](docs/CONTRIBUTING.md) - Guidelines for contributing to the project

## Development Setup

### Prerequisites

- Node.js (v16 or newer)
- npm (v7 or newer) or yarn (v1.22 or newer)
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/physipro.git
   cd physipro
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. Run on device or emulator:
   - Press `i` to run on iOS simulator
   - Press `a` to run on Android emulator
   - Scan the QR code with the Expo Go app on your device

## Testing

Run tests with:

```
npm test
# or
yarn test
```

## Deployment

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions on how to deploy the application to various environments.

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details on how to contribute to the project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
