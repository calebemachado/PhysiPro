# Contributing to PhysiPro

Thank you for your interest in contributing to PhysiPro! This document provides guidelines and instructions for contributing to the project. By following these guidelines, you can help us maintain a high-quality, consistent codebase.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Commit Message Guidelines](#commit-message-guidelines)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation](#documentation)
9. [Issue Reporting](#issue-reporting)
10. [Feature Requests](#feature-requests)

## Code of Conduct

We expect all contributors to follow our Code of Conduct. By participating in this project, you agree to abide by its terms. Please be respectful and considerate when interacting with other contributors.

## Getting Started

Before contributing to PhysiPro, please:

1. Ensure you have read the [README.md](../README.md) file to understand the project's purpose and structure
2. Review the [ARCHITECTURE.md](./ARCHITECTURE.md) document to understand the system design
3. Set up your development environment following the instructions in [SETUP.md](./SETUP.md)
4. Check the existing [issues](https://github.com/yourusername/physipro/issues) to see if your planned contribution is already being addressed

## Development Workflow

We follow a feature-branch workflow:

1. **Fork the repository** (if you're an external contributor)
2. **Clone the repository** locally
    ```
    git clone https://github.com/yourusername/physipro.git
    cd physipro
    ```
3. **Create a new branch** for your feature or bugfix
    ```
    git checkout -b feature/your-feature-name
    ```
    or
    ```
    git checkout -b fix/issue-you-are-fixing
    ```
4. **Make your changes** following the coding standards
5. **Test your changes** thoroughly
6. **Commit your changes** with clear commit messages
7. **Push your branch** to your fork
    ```
    git push origin feature/your-feature-name
    ```
8. **Create a Pull Request** from your branch to the main repository

## Pull Request Process

1. Ensure your PR has a clear title and description that explains the changes made
2. Link any related issues in the PR description using keywords like "Fixes #123" or "Relates to #456"
3. Make sure all tests pass and new features have appropriate test coverage
4. Update documentation if your changes affect the API, UI, or build process
5. Follow up on any feedback or requested changes from reviewers promptly
6. Wait for approval from at least one maintainer before merging

## Coding Standards

Please follow the project's [Style Guide](./STYLE_GUIDE.md), which includes:

- TypeScript guidelines
- React component structure
- Styling conventions
- File organization principles

Additionally:

- **Keep it DRY** (Don't Repeat Yourself) - avoid code duplication
- **Keep components small** - each component should have a single responsibility
- **Optimize performance** - use memoization and other performance techniques where appropriate
- **Write meaningful comments** - but prefer self-documenting code where possible

## Commit Message Guidelines

We follow conventional commits for clear communication and automated versioning:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types include:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Changes that don't affect code functionality (formatting, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or correcting tests
- **chore**: Changes to build process, dependencies, etc.

Examples:
```
feat(auth): add login screen with email validation

fix(trainer): resolve student list not loading issue
```

## Testing Guidelines

We value well-tested code. Please follow these testing guidelines:

1. **Write tests for new features** - aim for good coverage of your code
2. **Update tests for bug fixes** - add tests that would have caught the bug
3. **Use the testing framework consistently** - follow patterns in existing tests
4. **Run the full test suite** before submitting PRs

Run tests using:
```
npm test
```

## Documentation

Good documentation is essential. When contributing, please:

1. Update the README if you change the project setup or requirements
2. Document new features in the appropriate place
3. Comment your code where necessary, especially for complex logic
4. Update API documentation if you modify any interfaces

## Issue Reporting

If you find a bug or have a suggestion:

1. Check the existing issues first to avoid duplicates
2. Use the issue template if available
3. Provide clear steps to reproduce bugs
4. Include screenshots or error logs if relevant
5. Mention your environment (OS, Node version, device if mobile, etc.)

## Feature Requests

We welcome feature suggestions:

1. Clearly describe the feature and the problem it solves
2. Explain why this feature would benefit the project
3. Provide examples of how it would be used
4. Be open to discussion about implementation details

Thank you for contributing to PhysiPro! Your efforts help make this project better for everyone. 