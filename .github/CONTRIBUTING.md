# Contributing to React Starter Kit

We're thrilled you're interested in contributing to React Starter Kit! Your participation helps make this project better for everyone. Whether you're fixing bugs, improving documentation, or proposing new features, we value and appreciate your efforts.

This guide will help you get started with contributing to our project. Following these guidelines ensures a smooth collaboration process and helps us maintain high-quality standards across the codebase.

## Table of Contents

- [Contributing to React Starter Kit](#contributing-to-react-starter-kit)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Ways to Contribute](#ways-to-contribute)
  - [Your First Contribution](#your-first-contribution)
  - [Development Environment Setup](#development-environment-setup)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
  - [Development Workflow](#development-workflow)
    - [Project Structure](#project-structure)
    - [Working with UI Components](#working-with-ui-components)
    - [Database Changes](#database-changes)
  - [Submitting Issues](#submitting-issues)
    - [Bug Reports](#bug-reports)
    - [Feature Requests](#feature-requests)
  - [Pull Request Process](#pull-request-process)
    - [Before You Begin](#before-you-begin)
    - [Creating Your Pull Request](#creating-your-pull-request)
    - [PR Review Process](#pr-review-process)
  - [Coding Standards](#coding-standards)
    - [TypeScript \& React](#typescript--react)
    - [Code Style](#code-style)
    - [Testing](#testing)
    - [Documentation](#documentation)
  - [Getting Help](#getting-help)
  - [Recognition](#recognition)

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please make sure you are welcoming and friendly in all of our spaces.

## Ways to Contribute

There are many ways to contribute to React Starter Kit:

- **Report bugs** - Help us identify and fix issues
- **Suggest features** - Share ideas for new functionality
- **Improve documentation** - Fix typos, clarify concepts, or add examples
- **Submit code changes** - Fix bugs or implement features
- **Review pull requests** - Help review and test other contributors' changes
- **Write tutorials** - Create guides or blog posts about using the starter kit
- **Answer questions** - Help other users in issues or discussions
- **Improve tests** - Add missing tests or improve existing ones

## Your First Contribution

Looking for a place to start? Check out issues labeled with:

- [`good first issue`](https://github.com/kriasoft/react-starter-kit/labels/good%20first%20issue) - Beginner-friendly issues
- [`help wanted`](https://github.com/kriasoft/react-starter-kit/labels/help%20wanted) - Issues where we need community help
- [`documentation`](https://github.com/kriasoft/react-starter-kit/labels/documentation) - Documentation improvements

**Before starting work on a significant change:**

1. Check if someone else is already working on it
2. Open an issue to discuss your proposal
3. Wait for feedback from maintainers before investing significant time

## Development Environment Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.0
- [Node.js](https://nodejs.org) >= 20 (for some tooling compatibility)
- [Git](https://git-scm.com)

### Getting Started

1. **Fork and clone the repository:**

   ```bash
   # Fork the repo on GitHub, then:
   git clone https://github.com/<your-username>/react-starter-kit.git
   cd react-starter-kit
   git remote add upstream https://github.com/kriasoft/react-starter-kit.git
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Configure environment variables (optional):**

   The project includes default environment variables in `.env`. If you need to override any values for local development:

   ```bash
   # Create a .env.local file for your overrides
   touch .env.local
   # Add only the variables you need to override
   ```

4. **Run the development server:**

   ```bash
   # Start all three apps together (web, api, and app)
   bun dev

   # Or start specific apps individually:
   bun web:dev   # Marketing site
   bun app:dev   # Main application
   bun api:dev   # API server

   # Note: You may need to build email templates first:
   bun email:build
   ```

5. **Run tests:**

   ```bash
   bun test
   ```

## Development Workflow

### Project Structure

This is a monorepo with the following structure:

- `apps/web/` - Marketing website
- `apps/app/` - Main React application
- `apps/api/` - tRPC API server
- `apps/email/` - React Email templates
- `packages/core/` - Shared utilities
- `packages/ui/` - Shared UI components
- `db/` - Database schemas and migrations
- `docs/` - Documentation site

### Working with UI Components

```bash
# Add a new shadcn/ui component
bun ui:add button

# List installed components
bun ui:list

# Update components
bun ui:update
```

### Database Changes

```bash
# Generate migrations (optionally with a descriptive name)
bun --filter @repo/db generate
# or
bun --filter @repo/db generate add-user-table

# Apply schema changes
bun --filter @repo/db push

# Open database studio
bun --filter @repo/db studio
```

## Submitting Issues

### Bug Reports

Before submitting a bug report:

1. Search existing issues to avoid duplicates
2. Try to reproduce with the latest `main` branch
3. Prepare a minimal reproduction case

Include in your bug report:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Bun version, etc.)
- Error messages and stack traces
- Screenshots if relevant

### Feature Requests

When proposing a new feature:

1. Check if it aligns with the project's goals
2. Search for existing similar requests
3. Provide detailed use cases
4. Explain why this feature would benefit most users
5. Consider implementation complexity

## Pull Request Process

### Before You Begin

1. **Discuss significant changes** - Open an issue first for major features or refactoring
2. **Check existing PRs** - Ensure you're not duplicating effort
3. **One PR, one concern** - Keep PRs focused on a single issue or feature

### Creating Your Pull Request

1. **Update your fork:**

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

3. **Make your changes:**
   - Follow our coding standards
   - Add/update tests as needed
   - Update documentation if applicable
   - Keep commits atomic and descriptive

4. **Test your changes:**

   ```bash
   # Run tests
   bun test

   # Check linting
   bun lint

   # Build the project
   bun build
   ```

5. **Commit your changes:**
   - Write clear, concise commit messages
   - Use conventional commit format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

6. **Push to your fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request:**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changes you made and why
   - Include screenshots for UI changes
   - Check all CI checks pass

### PR Review Process

- Maintainers will review your PR within 1-5 days
- Address any requested changes promptly
- Keep your branch up to date with `main`
- Be patient and respectful during the review process

## Coding Standards

### TypeScript & React

- Use functional components and hooks
- Prefer named exports over default exports
- Use TypeScript strict mode
- Follow existing patterns in the codebase

### Code Style

- Modern TypeScript features (const assertions, template literals)
- Functional programming patterns where appropriate
- Clear, self-documenting code
- Meaningful variable and function names

### Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Use Vitest for unit tests

### Documentation

- Update README if adding new features
- Document complex logic with comments
- Keep documentation concise and accurate

## Getting Help

Need assistance? Here's where to find help:

- **Discord** - Join our [community Discord server](https://discord.gg/2nKEnKq) for real-time help
- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For questions and community discussions
- **Stack Overflow** - Tag your questions with `react-starter-kit`

## Recognition

We value all contributions! Contributors are:

- Listed in our [Contributors](https://github.com/kriasoft/react-starter-kit/graphs/contributors) page
- Mentioned in release notes for significant contributions
- Eligible to become maintainers with consistent, quality contributions

Thank you for helping make React Starter Kit better for everyone!

---

**License:** By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE.txt).
