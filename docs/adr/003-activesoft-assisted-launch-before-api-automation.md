# ADR-003 ActiveSoft Assisted Launch Before API Automation

**Status:** Accepted  
**Date:** 2026-05-19  
**Tags:** integration, activesoft, risk, audit

## Problem

Clara needs to work with ActiveSoft, but public ActiveSoft material verifies frequency API behavior and portal occurrence workflows without confirming a public occurrence-creation API contract. Building automatic occurrence writes now would rely on an unverified assumption.

## Decision

Ship the MVP with assisted ActiveSoft launch. Clara will generate and store approved ActiveSoft-ready text, then coordination will manually launch it in ActiveSoft and record the outcome in Clara. Automated occurrence writes stay disabled until official endpoint documentation, token permissions, sandbox proof, and audit behavior are confirmed.

Frequency integration may be explored separately because public ActiveSoft docs identify `api/v1/marcar_frequencia_aluno/` for sending frequency records, but even that must be validated with the school's token and environment before production use.

## Alternatives Brief

- Build occurrence API adapter now: rejected because the endpoint contract is not publicly confirmed.
- Skip ActiveSoft entirely: rejected because ActiveSoft is the official school history system.
- Manual-only forever: rejected as a long-term limit, but accepted for MVP risk reduction.

## Impact

- Positive: MVP remains useful without waiting for vendor access; avoids unsafe official writes; creates clear integration evidence requirements.
- Negative/Risks: coordination still has some manual work; reconciliation needs careful launch logging.

## Links

- Code/Docs: `/docs/integrations/activesoft`, `/docs/product/roadmap`
- Related ADRs: `/docs/adr/002-clara-pwa-first-guided-capture`, `/docs/adr/004-student-record-privacy-boundary`
