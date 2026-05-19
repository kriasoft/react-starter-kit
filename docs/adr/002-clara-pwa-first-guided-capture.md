# ADR-002 Clara PWA-First Guided Capture

**Status:** Accepted  
**Date:** 2026-05-19  
**Tags:** product, frontend, classroom-workflow, ai-boundary

## Problem

Teachers need to record classroom routine quickly, but a free-form chatbot or WhatsApp-first workflow increases the risk of wrong students, long conversations, unstructured records, and accidental publication of unsafe language.

## Decision

Build Clara first as a guided web/PWA classroom workflow. The first interface is "today's classes" -> "start class" -> attendance -> homework/material checks -> event capture -> review queue. AI, voice, and WhatsApp are later input helpers only; they do not own the workflow and cannot bypass review.

## Alternatives Brief

- WhatsApp-first capture: familiar, but weak for multi-select, class roster confirmation, privacy controls, and structured review.
- Free-form AI chatbot: fast to prototype, but too risky for student records and official history.
- Direct ActiveSoft usage only: keeps one system, but does not solve the PRD's speed, language quality, and review-gate problems.

## Impact

- Positive: safer classroom UX, stronger data structure, better mobile ergonomics, lower risk of accidental official records.
- Negative/Risks: slower than a simple chat prototype; requires building Clara-specific UI and domain schema before flashy AI features.

## Links

- Code/Docs: `/prd.md`, `/docs/product/roadmap`
- Related ADRs: `/docs/adr/003-activesoft-assisted-launch-before-api-automation`, `/docs/adr/004-student-record-privacy-boundary`
