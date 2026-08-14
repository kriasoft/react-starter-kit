# Security Incident Playbook

This is an operational starting point for applications built from React Starter Kit. It deliberately does not invent a security address, response-time promise, team structure, or disclosure policy. Define those for your organization before launch.

## Prepare Before an Incident

Record this information somewhere responders can reach when the application or primary repository is unavailable:

| Item                                   | Owner or location                   |
| -------------------------------------- | ----------------------------------- |
| Security report channel                | _Define before launch_              |
| Incident lead and backup               | _Define before launch_              |
| Cloudflare account and audit logs      | _Define before launch_              |
| Neon project and restore procedure     | _Define before launch_              |
| Resend, Google, and Stripe accounts    | _Define as enabled_                 |
| GitHub private vulnerability reporting | _Enable or document an alternative_ |
| User notification and legal contacts   | _Define before launch_              |

Also keep tested access for at least two responders, require MFA on provider accounts, and store recovery codes outside the systems they recover.

## 1. Receive and Triage

1. Move the report to the approved confidential channel. Do not discuss an unpatched vulnerability in a public issue or pull request.
2. Preserve the original report, timestamps, relevant request IDs, logs, and provider audit events. Restrict access to people working the incident.
3. Reproduce in an isolated environment with synthetic data when possible.
4. Identify affected environments, versions, tenants, data, credentials, and time range.
5. Assign severity from demonstrated impact and exploitability. Treat active exploitation, authentication bypass, remote code execution, exposed signing secrets, or broad sensitive-data access as urgent.
6. Name one incident lead and one person responsible for the activity log.

The activity log should distinguish verified facts from hypotheses and record who made each containment or recovery change.

## 2. Contain

Choose the smallest action that stops further harm without destroying evidence:

- Disable or restrict the affected route, integration, account, or Worker.
- Add a temporary Cloudflare WAF rule when traffic can be identified safely.
- Revoke exposed credentials at their issuing provider, then replace the Worker secret in every affected environment. Changing a secret creates a new Worker version; verify which version receives traffic.
- Invalidate sessions or rotate `BETTER_AUTH_SECRET` only when the impact warrants signing everyone out. Rotation invalidates existing signed state.
- For database exposure, rotate the Neon role password, update both Hyperdrive configurations, and verify direct migration credentials separately.
- For a malicious dependency or build credential, stop deployments until the build inputs and artifacts are trusted again.

Do not run destructive cleanup merely to make the system look normal. Preserve the data needed to determine scope, and record every emergency change that must later be reconciled with version-controlled configuration.

## 3. Investigate

- [ ] Establish the earliest known exploitation and the last known safe state.
- [ ] Trace the request path through web, app, API, provider, and database logs.
- [ ] Check sibling endpoints and repeated code patterns, not only the reported URL.
- [ ] Determine whether cached results, queues, webhooks, object storage, logs, backups, or third parties contain affected data.
- [ ] Identify which credentials and sessions existed during the affected window and whether they were used unexpectedly.
- [ ] Write a minimal proof of concept and a regression test without retaining real secrets or personal data.
- [ ] Document the root cause and why existing controls did not catch it.

Cloudflare request IDs and the API request ID are useful correlation keys. Avoid copying full authorization headers, cookies, OTPs, or database URLs into the incident log.

## 4. Eradicate and Recover

1. Fix the root cause and close equivalent paths.
2. Add tests that fail for the original exploit and pass for legitimate use.
3. Run the checks in the [security checklist](./checklist).
4. Deploy to staging and verify the containment still holds.
5. Apply production database changes only after reviewing compatibility with the currently deployed Worker versions.
6. Deploy service-binding targets before the web router: API, app, then web.
7. Verify authentication, authorization, enabled integrations, headers, rate-limits, logs, and key user flows in production.
8. Remove temporary controls only after the permanent fix is confirmed.
9. Reconcile dashboard changes with Wrangler, Terraform, and documentation so a later deploy cannot undo the response.

A Worker rollback changes code and configuration version; it does not reverse a database migration or restore deleted data. Use the Neon restore procedure when data recovery is required, and test the restored branch before cutover.

## 5. Notify and Disclose

Coordinate notification with the application owner's legal and privacy obligations. Communicate confirmed facts, affected scope, containment status, required user action, and the next update time. Do not promise a patch date or claim no data was accessed until evidence supports it.

For a vulnerability in the upstream starter kit:

1. Use the repository's private vulnerability reporting channel when enabled.
2. Prepare a GitHub Security Advisory with affected versions, impact, fix, and workarounds.
3. Coordinate public disclosure after a fix is available or when continued secrecy no longer reduces harm.
4. Request a CVE through the advisory only when the project and issue qualify.

For an application-specific incident, notify that application's users and operators rather than the starter-kit repository.

## 6. Review

After recovery, produce a short record containing:

- the factual timeline;
- root cause and contributing conditions;
- affected data, users, environments, and integrations;
- containment and recovery actions;
- detection gaps;
- durable follow-up items, owners, and due dates.

Update this playbook only with lessons that generalize. Keep incident-specific names, credentials, evidence, and internal contacts in the restricted incident record, not in public repository documentation.

## Useful References

- [Security checklist](./checklist)
- [Authentication](/auth/)
- [Cloudflare deployment](/deployment/cloudflare)
- [CI/CD and rollback](/deployment/ci-cd)
- [Production database](/deployment/production-database)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
