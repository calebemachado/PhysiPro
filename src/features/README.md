# Features

This directory contains all the feature modules of the application, organized by access level.

## Structure

- **public**: Features that are accessible to all users (authenticated or not)
  - authentication: Login, register, and password recovery

- **protected**: Features that are only accessible to authenticated users
  - admin: Admin-specific features
  - trainer: Trainer-specific features
  - student: Student-specific features

## Architecture

Each feature module follows a similar structure:

- **components**: Reusable UI components specific to the feature
- **screens**: Full page components used by the router
- **hooks**: Custom React hooks specific to the feature
- **services**: API and business logic
- **types**: TypeScript types and interfaces
- **utils**: Utility functions 