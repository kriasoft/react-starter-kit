# ADR-004 Student Record Privacy Boundary

**Status:** Accepted  
**Date:** 2026-05-19  
**Tags:** privacy, minors, review, audit, ai-safety

## Problem

Clara handles records about children and adolescents. Raw teacher notes, audio, transcripts, and AI suggestions may contain informal language, other-student names, sensitive facts, or unverified interpretation. Those fields cannot be treated as official or family-visible text.

## Decision

Separate raw capture, internal normalized summary, ActiveSoft draft, family draft, approved ActiveSoft observation, and approved family message. Only approved fields may be launched or shown externally. Sensitive cases require coordination review. Batch events must produce individual records, and individual records must not include names of other students.

## Alternatives Brief

- Single text field with status: rejected because raw and approved text become easy to confuse.
- AI-generated official text: rejected because AI may invent or overstate facts.
- Teacher direct publish to family/ActiveSoft: rejected for legal, pedagogical, and institutional risk.

## Impact

- Positive: clear data provenance, safer review, testable privacy invariants, better audit trail.
- Negative/Risks: more schema and workflow complexity; requires deliberate UI to avoid confusing reviewers.

## Links

- Code/Docs: `/prd.md`, `/docs/product/roadmap`
- Related ADRs: `/docs/adr/002-clara-pwa-first-guided-capture`, `/docs/adr/003-activesoft-assisted-launch-before-api-automation`
