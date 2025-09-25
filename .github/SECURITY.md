# Security Policy & Incident Response Plan

## Our Security Commitment

The React Starter Kit team takes security seriously. We appreciate responsible disclosure of vulnerabilities and are committed to working with security researchers to keep our project secure.

This document outlines our security policy, incident response procedures, and how to report vulnerabilities.

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

## Incident Response

- **Report Security Issues**: `security@kriasoft.com`
- **Initial Response**: Within 2 business days
- **Critical Issues**: Escalated immediately to maintainers

## Reporting a Vulnerability

**⚠️ DO NOT report security vulnerabilities through public GitHub issues.**

Report to: **security@kriasoft.com**

### Include in Your Report

1. **Description**: Clear explanation of the vulnerability and impact
2. **Steps to Reproduce**: Minimal steps to demonstrate the issue
3. **Proof of Concept**: Code or screenshots if applicable
4. **Affected Version**: Branch or commit hash
5. **Suggested Fix**: Optional recommendations

## Incident Response Process

### Severity Classification

We classify security incidents based on their potential impact:

- **Critical (P0)**: Remote code execution, authentication bypass, data breach affecting all users
- **High (P1)**: Privilege escalation, significant data exposure, XSS in authentication flows
- **Medium (P2)**: Limited data exposure, XSS in non-critical areas, CSRF vulnerabilities
- **Low (P3)**: Information disclosure, minor security misconfigurations

### Response Timeline

| Severity | Initial Response | Fix Target  | Disclosure   |
| -------- | ---------------- | ----------- | ------------ |
| Critical | 2 days           | 14 days     | Upon patch   |
| High     | 3 days           | 30 days     | Upon patch   |
| Medium   | 5 days           | 60 days     | Upon patch   |
| Low      | 7 days           | Best effort | With release |

### How We Handle Reports

1. **Acknowledge** - We confirm receipt within 2 business days
2. **Validate** - We reproduce and assess the issue
3. **Fix** - We develop and test a patch
4. **Release** - We publish the fix and security advisory
5. **Credit** - We acknowledge your contribution (unless you prefer anonymity)

## Working Together

- We communicate via email and keep you informed of progress
- We explain our decisions if we determine something isn't a vulnerability
- Please keep issues confidential until patched

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

## Security Quick Start

### Essential Setup

```bash
# Check for vulnerabilities
bun audit

# Enable GitHub security features
# Settings > Security > Code security and analysis
# ✓ Dependabot alerts
# ✓ Secret scanning
```

### Secret Management

- **Never commit secrets** - Use `.env.local` (gitignored) for local development
- **Production secrets** - Store in Cloudflare Workers secrets or GitHub Actions secrets
- **Client code** - Only expose `PUBLIC_*` prefixed variables to browser

### Key Commands

```bash
bun audit              # Check dependencies
bun test:security      # Run security tests (if configured)
bun update --latest    # Update dependencies
```

## Additional Resources

- [GitHub Security Advisories](https://github.com/kriasoft/react-starter-kit/security/advisories)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Cloudflare Workers Security Best Practices](https://developers.cloudflare.com/workers/platform/security/)
- [React Security Best Practices](https://react.dev/learn/security)

---

Thank you for helping us keep React Starter Kit and its community safe!
