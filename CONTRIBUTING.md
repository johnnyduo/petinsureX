# Contributing to PetInsureX

Thank you for your interest in contributing to PetInsureX! We welcome contributions from the community and are pleased to have you join us.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find that you don't need to create one. When you create a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if applicable**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Setup

### Prerequisites

- Node.js 18+ or Bun
- Yarn package manager (preferred)

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/pet-pal-guard.git
cd pet-pal-guard

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Application pages/routes
├── types/           # TypeScript definitions
├── lib/             # Utilities and constants
└── hooks/           # Custom React hooks
```

### Coding Standards

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex business logic
- **Types**: Prefer interfaces over types for object shapes

### Component Guidelines

- Use functional components with hooks
- Follow the existing component structure
- Use proper TypeScript typing
- Include proper accessibility attributes
- Follow the glassmorphism design system

### Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

### Building

```bash
# Production build
yarn build

# Preview production build
yarn preview
```

## Style Guide

### JavaScript/TypeScript

- Use modern ES6+ features
- Prefer const over let, avoid var
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use optional chaining and nullish coalescing

### React

- Use functional components with hooks
- Use custom hooks for shared logic
- Keep components small and focused
- Use proper key props for lists
- Handle loading and error states

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow the existing glassmorphism design patterns
- Use consistent spacing (4px grid system)
- Ensure responsive design
- Test on multiple devices

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(claims): add real-time fraud detection
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

## AI/ML Guidelines

### Computer Vision

- Ensure proper image preprocessing
- Validate model confidence thresholds
- Test with diverse pet breeds and lighting conditions
- Document training data requirements

### Fraud Detection

- Maintain high precision to avoid false positives
- Regularly update fraud patterns
- Ensure explainability of AI decisions
- Test edge cases thoroughly

### Privacy & Security

- Follow zero-knowledge proof principles
- Encrypt sensitive data
- Validate all inputs
- Use secure cryptographic libraries

## Questions?

Don't hesitate to ask questions by:
- Creating an issue with the `question` label
- Joining our Discord community

Thank you for contributing to PetInsureX! 🐾
