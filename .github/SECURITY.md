# Security Policy

## Our Security Commitment

The React Starter Kit team and community take the security of our project seriously. We appreciate the efforts of security researchers and believe that responsible disclosure of security vulnerabilities helps us ensure the security and privacy of all users.

We are committed to working with the community to verify, reproduce, and respond to legitimate reported vulnerabilities. Thank you for helping us maintain a secure foundation for modern web applications.

## Scope

This security policy applies to vulnerabilities discovered within the `react-starter-kit` repository itself. The scope includes:

- Core application code and configurations
- Build processes and deployment scripts
- Authentication and authorization implementations
- API endpoints and tRPC procedures
- Database schemas and migrations
- Infrastructure configurations (Terraform, Cloudflare Workers)
- Default security configurations provided by the starter kit

### Out of Scope

The following are considered **out of scope** for this policy:

- Vulnerabilities in applications built _using_ the starter kit, unless the vulnerability is directly caused by a flaw in the starter kit's code
- Vulnerabilities in third-party dependencies that have already been publicly disclosed (please use `bun audit` or await Dependabot alerts)
- Security issues resulting from user misconfiguration or failure to follow documented security best practices
- Issues that require physical access to the user's device or compromised development environment
- Vulnerabilities requiring a compromised CI/CD pipeline or build environment
- Social engineering attacks against project maintainers or users

## Supported Versions

We provide security updates for the most recent version of React Starter Kit available on the `main` branch. We strongly encourage all users to use the latest stable version of the project to benefit from the latest security patches and improvements.

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < main  | :x:                |

## Reporting a Vulnerability

**⚠️ Please DO NOT report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please send a detailed report to: **security@kriasoft.com**

To help us triage and validate your report efficiently, please include:

### Required Information

- **Title**: A clear, descriptive summary of the vulnerability
- **Description**: A detailed explanation of the vulnerability and its potential impact
- **Affected Component(s)**: Specific files, modules, or features affected (e.g., `apps/api/src/auth.ts`, Better Auth configuration, tRPC procedures)
- **Steps to Reproduce**:
  1. Clear, numbered steps to reproduce the issue
  2. Include any necessary configuration or environment details
  3. Expected vs. actual behavior
- **Proof of Concept (PoC)**: Working code, scripts, or screenshots demonstrating the vulnerability
- **Impact Assessment**: Your assessment of the severity and potential impact:
  - Data exposure or leakage
  - Authentication/authorization bypass
  - Remote code execution
  - Denial of service
  - Cross-site scripting (XSS)
  - Other security impacts

### Optional Information

- **Suggested Fix**: If you have ideas for how to address the vulnerability
- **References**: Links to similar vulnerabilities or relevant documentation
- **Your Contact Information**: Name/alias for public credit and preferred contact method

## Disclosure Process

Once we receive your security report, we will follow this process:

### 1. Acknowledgment (Within 2 Business Days)

We will acknowledge receipt of your vulnerability report and provide you with a tracking reference.

### 2. Initial Triage (Within 7 Business Days)

Our team will:

- Validate the vulnerability
- Assess its impact and severity
- Determine affected components
- Provide you with an initial assessment and expected timeline

### 3. Remediation (Target: 90 Days)

We will:

- Develop and test a fix for the vulnerability
- Prepare security patches for affected versions
- Request a CVE identifier from GitHub if appropriate
- Coordinate the release timeline with you

### 4. Public Disclosure

Once the patch is released:

- We will publish a security advisory on GitHub
- Full credit will be given to the reporter (unless you prefer to remain anonymous)
- The advisory will include:
  - Description of the vulnerability
  - Impact assessment
  - Affected versions
  - Patched versions
  - Workarounds (if any)
  - Credits and acknowledgments

## Communication Expectations

- All security-related communications will be conducted via email
- We will keep you informed throughout the remediation process
- If our investigation determines that the issue is not a security vulnerability, we will explain our reasoning
- We ask that you keep the vulnerability confidential until we've had adequate time to address it

## Safe Harbor

We consider security research conducted in good faith and in accordance with this policy to be:

- Authorized concerning any applicable anti-hacking laws and regulations
- Exempt from restrictions in our Terms of Service that would interfere with security research
- Lawful, helpful, and appreciated

We will not pursue or support legal action against researchers who:

- Make a good faith effort to follow this security policy
- Discover and report vulnerabilities responsibly
- Avoid privacy violations, destruction of data, or interruption of our services
- Do not exploit vulnerabilities beyond what is necessary to demonstrate them

If legal action is initiated by a third party against you for your security research, we will make it known that your actions were conducted in compliance with this policy.

## Recognition

We greatly value the contributions of security researchers. With your permission, we will:

- Publicly credit you in our security advisories
- Add your name to our security acknowledgments
- Provide a letter of appreciation upon request

## Security Best Practices for Users

While this policy covers vulnerabilities in the starter kit itself, we recommend all users follow these security best practices:

### Configuration & Secret Management

- Do commit `.env` for non-sensitive defaults and documentation; never store secrets (API keys, tokens, DB URLs) in `.env`.
- Do not commit secrets. Store them in:
  - `.env.local` (developer/runner-specific, gitignored)
  - `terraform.tfvars` (infra inputs that may include secrets, gitignored)
  - a secret manager for CI/CD and production:
    - GitHub Actions: Encrypted Secrets (repo/org/environment)
    - Cloudflare Workers: wrangler secret put / dashboard secrets
    - Google Cloud: Secret Manager
- Ensure `.env.local` and `terraform.tfvars` are in `.gitignore` and never pushed.
- Browser safety: Never reference server-only secrets in client code. Only expose explicitly public variables intended for the browser (e.g., values with a `PUBLIC_` prefix). Review bundles to ensure no server secrets are included.
- Rotation and scanning: Rotate secrets regularly and enable secret scanning (GitHub Advanced Security, trufflehog, git-secrets) to prevent accidental leaks.

### Authentication

- Implement proper session management
- Use secure password policies
- Enable multi-factor authentication where appropriate
- Regularly update Better Auth and related dependencies

### Dependencies

- Regularly run `bun audit` to check for vulnerable dependencies
- Keep all dependencies up to date
- Review dependency licenses and security advisories

### Deployment

- Use HTTPS for all production deployments
- Implement proper CORS policies
- Enable security headers (CSP, HSTS, etc.)
- Regular security audits of your deployed applications

## Additional Resources

- [GitHub Security Advisories](https://github.com/kriasoft/react-starter-kit/security/advisories)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Cloudflare Workers Security Best Practices](https://developers.cloudflare.com/workers/platform/security/)
- [React Security Best Practices](https://react.dev/learn/security)

---

Thank you for helping us keep React Starter Kit and its community safe!
