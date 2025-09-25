# Security Best Practices Checklist

A comprehensive security checklist for React Starter Kit applications. Review this checklist during development, before deployment, and regularly in production.

## Development Phase

### Code Security

#### Input Validation

- [ ] Validate all user inputs on both client and server
- [ ] Use Zod schemas for type-safe validation
- [ ] Sanitize HTML content to prevent XSS
- [ ] Validate file uploads (type, size, content)
- [ ] Implement rate limiting on forms and APIs

```typescript
// Example: tRPC input validation with Zod
export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1).max(100),
        age: z.number().int().positive().max(120),
      }),
    )
    .mutation(async ({ input }) => {
      // Input is already validated
    }),
});
```

#### Authentication & Authorization

- [ ] Use Better Auth for authentication
- [ ] Implement proper session management
- [ ] Use secure session storage (httpOnly cookies)
- [ ] Implement CSRF protection
- [ ] Check permissions on every protected route
- [ ] Log authentication events

```typescript
// Example: Protected tRPC procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});
```

#### Data Protection

- [ ] Never log sensitive data (passwords, tokens, PII)
- [ ] Use parameterized queries (Drizzle ORM)
- [ ] Encrypt sensitive data at rest
- [ ] Implement proper error handling without data leaks
- [ ] Use HTTPS for all communications
- [ ] Validate and sanitize database queries

```typescript
// Example: Safe database query with Drizzle
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.email, email)); // Parameterized, prevents SQL injection
```

### Secret Management

#### Environment Variables

- [ ] Store secrets in `.env.local` (never commit)
- [ ] Use `.env` only for non-sensitive defaults
- [ ] Document required variables in `.env`
- [ ] Validate environment variables at startup
- [ ] Use different secrets for each environment

```typescript
// Example: Environment validation
const env = z
  .object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    SMTP_PASSWORD: z.string(),
    PUBLIC_API_URL: z.string().url(), // Safe for client
  })
  .parse(process.env);
```

#### Production Secrets

- [ ] Use Cloudflare Workers secrets for production
- [ ] Rotate secrets regularly
- [ ] Never hardcode secrets in code
- [ ] Audit secret access logs
- [ ] Use secret scanning in CI/CD

### Dependencies

#### Package Management

- [ ] Run `bun audit` regularly
- [ ] Review new dependencies before adding
- [ ] Check dependency licenses
- [ ] Enable Dependabot alerts
- [ ] Keep dependencies up to date
- [ ] Use lock files (`bun.lockb`)

```bash
# Security audit commands
bun audit                    # Check for vulnerabilities
bun update --latest          # Update dependencies
bun pm ls                    # List all dependencies
```

#### Supply Chain Security

- [ ] Verify package authenticity
- [ ] Use specific versions (not wildcards)
- [ ] Review dependency source code for critical packages
- [ ] Monitor for dependency hijacking
- [ ] Use SubResource Integrity (SRI) for CDN resources

## Pre-Deployment Phase

### Security Headers

#### Configure Headers

- [ ] Content Security Policy (CSP)
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] Strict-Transport-Security (HSTS)
- [ ] Referrer-Policy
- [ ] Permissions-Policy

```typescript
// Example: Security headers in Hono
app.use("*", async (c, next) => {
  await next();
  c.header("X-Frame-Options", "DENY");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Strict-Transport-Security", "max-age=31536000");
  c.header("Content-Security-Policy", "default-src 'self'");
});
```

### API Security

#### tRPC Security

- [ ] Validate all inputs with Zod
- [ ] Implement rate limiting
- [ ] Use proper error codes
- [ ] Don't expose internal errors
- [ ] Log suspicious activities
- [ ] Implement request timeouts

```typescript
// Example: Rate limiting middleware
const rateLimiter = new Map();

export const rateLimit = middleware(async ({ ctx, next }) => {
  const key = ctx.ip;
  const limit = rateLimiter.get(key) || 0;

  if (limit > 10) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  rateLimiter.set(key, limit + 1);
  setTimeout(() => rateLimiter.delete(key), 60000);

  return next();
});
```

#### CORS Configuration

- [ ] Configure allowed origins explicitly
- [ ] Don't use wildcard (\*) in production
- [ ] Validate Origin header
- [ ] Configure allowed methods and headers
- [ ] Use credentials carefully

### Client Security

#### React Security

- [ ] Avoid dangerouslySetInnerHTML
- [ ] Sanitize user-generated content
- [ ] Use Content Security Policy
- [ ] Validate URLs before navigation
- [ ] Implement proper error boundaries
- [ ] Don't expose sensitive data in state

```typescript
// Example: Safe HTML rendering
import DOMPurify from 'isomorphic-dompurify'

function SafeHTML({ content }: { content: string }) {
  const sanitized = DOMPurify.sanitize(content)
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />
}
```

#### Browser Storage

- [ ] Don't store sensitive data in localStorage
- [ ] Use httpOnly cookies for sessions
- [ ] Encrypt sensitive client-side data
- [ ] Clear storage on logout
- [ ] Implement storage quotas

## Deployment Phase

### Infrastructure Security

#### Cloudflare Workers

- [ ] Configure WAF rules
- [ ] Enable DDoS protection
- [ ] Set up rate limiting
- [ ] Configure security headers
- [ ] Enable bot protection
- [ ] Monitor security events

```toml
# Example: wrangler.toml security config
[env.production]
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[env.production.rate_limiting]
enabled = true
requests_per_minute = 60
```

#### CI/CD Security

- [ ] Use least privilege for CI/CD tokens
- [ ] Store secrets securely (GitHub Secrets)
- [ ] Enable branch protection
- [ ] Require code reviews
- [ ] Run security checks in pipeline
- [ ] Sign commits and releases

```yaml
# Example: GitHub Actions security
- name: Run security audit
  run: |
    bun audit
    bun test:security

- name: SAST Scan
  uses: github/super-linter@v5
  env:
    VALIDATE_JAVASCRIPT_ES: true
    VALIDATE_TYPESCRIPT_ES: true
```

### Monitoring & Logging

#### Security Monitoring

- [ ] Log authentication attempts
- [ ] Monitor for suspicious patterns
- [ ] Set up security alerts
- [ ] Track rate limit violations
- [ ] Monitor dependency vulnerabilities
- [ ] Review logs regularly

```typescript
// Example: Security event logging
function logSecurityEvent(event: {
  type: string;
  user?: string;
  ip: string;
  details: Record<string, any>;
}) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      severity: "SECURITY",
      ...event,
    }),
  );
}
```

#### Incident Response

- [ ] Have incident response plan ready
- [ ] Configure security notifications
- [ ] Set up backup and recovery
- [ ] Document security contacts
- [ ] Test incident procedures
- [ ] Keep security playbook updated

## Production Phase

### Ongoing Security

#### Regular Tasks

- [ ] Weekly: Review security alerts
- [ ] Monthly: Run dependency audits
- [ ] Quarterly: Security assessment
- [ ] Annually: Penetration testing
- [ ] Ongoing: Security training

#### Security Updates

- [ ] Monitor security advisories
- [ ] Apply patches promptly
- [ ] Test updates in staging
- [ ] Document security changes
- [ ] Communicate with users about security

### Compliance

#### Data Protection

- [ ] Implement GDPR compliance (if applicable)
- [ ] Add privacy policy
- [ ] Implement data deletion
- [ ] Log data access
- [ ] Encrypt personal data

#### Security Documentation

- [ ] Maintain SECURITY.md
- [ ] Document security procedures
- [ ] Keep incident log
- [ ] Update security checklist
- [ ] Train team on security

## Quick Security Wins

For immediate security improvements:

1. **Run Security Audit**

   ```bash
   bun audit
   ```

2. **Add Security Headers**

   ```typescript
   // apps/api/src/index.ts
   app.use(securityHeaders());
   ```

3. **Implement Rate Limiting**

   ```typescript
   // apps/api/src/middleware.ts
   app.use(rateLimit({ limit: 100, window: "1m" }));
   ```

4. **Enable HTTPS Redirect**

   ```typescript
   // apps/web/src/index.ts
   if (location.protocol === "http:") {
     location.replace("https:" + window.location.href.substring(5));
   }
   ```

5. **Add Input Validation**

   ```typescript
   // Use Zod everywhere
   const schema = z.object({
     /* ... */
   });
   const validated = schema.parse(input);
   ```

## Security Resources

### Tools

- [OWASP ZAP](https://www.zaproxy.org/) - Security scanning
- [Snyk](https://snyk.io/) - Dependency scanning
- [GitHub Security](https://github.com/security) - Security features
- [Mozilla Observatory](https://observatory.mozilla.org/) - Security assessment

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security](https://react.dev/learn/security)
- [Cloudflare Security](https://developers.cloudflare.com/workers/platform/security/)
- [Better Auth Docs](https://better-auth.com/docs/security)

### Emergency Contacts

- Security Issues: `security@kriasoft.com`
- GitHub Security: [Security Advisories](https://github.com/kriasoft/react-starter-kit/security)
- CVE Database: [MITRE CVE](https://cve.mitre.org/)

---

_Review this checklist regularly and update based on new threats and best practices._
