# Contributing to React Starter Kit

Thank you for your interest in contributing! Whether you're fixing bugs, improving documentation, or proposing new features — we appreciate your efforts.

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Your First Contribution

Look for issues labeled [`good first issue`](https://github.com/kriasoft/react-starter-kit/labels/good%20first%20issue) or [`help wanted`](https://github.com/kriasoft/react-starter-kit/labels/help%20wanted).

Before starting work on a significant change, open an issue to discuss your proposal and wait for feedback from maintainers.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.0
- [Node.js](https://nodejs.org) >= 20 (for some tooling)
- [Git](https://git-scm.com)

### Getting Started

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/<your-username>/react-starter-kit.git
   cd react-starter-kit
   git remote add upstream https://github.com/kriasoft/react-starter-kit.git
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:

   ```bash
   bun dev                # Start all apps (web + api + app)

   # Or individually:
   bun web:dev            # Marketing site
   bun app:dev            # Main application
   bun api:dev            # API server
   ```

4. Verify your setup:

   ```bash
   bun test               # Run tests (Vitest)
   bun lint               # ESLint
   bun typecheck          # TypeScript
   ```

### Project Structure

See [`AGENTS.md`](../AGENTS.md) for the full monorepo layout, tech stack, and available commands.

## Pull Request Process

1. **Create a feature branch** from `main`:

   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Make focused changes** — one PR per concern. Follow existing patterns in the codebase.

3. **Verify before pushing:**

   ```bash
   bun test && bun lint && bun typecheck
   ```

4. **Write clear commit messages** using [conventional commits](https://www.conventionalcommits.org/):

   ```
   type(scope): description
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

5. **Open a pull request** against `main` with a clear description. Reference related issues and include screenshots for UI changes.

### Review Process

- Maintainers will review your PR within a few days
- Address requested changes promptly
- Keep your branch up to date with `main`

## Coding Standards

- Use functional components and hooks
- Prefer named exports over default exports
- Use TypeScript strict mode — avoid `any` and unnecessary type assertions
- Write tests for new features (Vitest)
- Prefer explicit, readable code over clever patterns
- See [`AGENTS.md`](../AGENTS.md) for the full design philosophy

## Developer Certificate of Origin (DCO)

This project uses the [Developer Certificate of Origin](https://developercertificate.org/) (DCO) version 1.1.

By contributing, you certify that you wrote the contribution yourself (or have the right to submit it) and agree to license it under the [MIT License](../LICENSE).

All commits must include a sign-off line:

```bash
git commit -s -m "feat(auth): add passkey support"
```

Contributions without a sign-off may be rejected by automated checks.

## AI-Assisted Contributions

AI tools may be used to help produce contributions. By submitting, you certify that you have reviewed and understand the code and that it does not include material you lack the right to submit under the MIT License.

The use of AI tools does not change the DCO requirements. The contributor remains the author of record and is responsible for the contribution.

## Getting Help

- **Discord** — [Community server](https://discord.gg/2nKEnKq)
- **GitHub Issues** — Bug reports and feature requests
- **GitHub Discussions** — Questions and community discussions

---

By contributing, you agree that your contributions will be licensed under the [MIT License](../LICENSE).
