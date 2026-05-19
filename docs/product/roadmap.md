# Clara Roadmap And Top Five Priorities

Last reviewed: 2026-05-19

This roadmap is ordered for risk reduction. Do not start with WhatsApp, open-ended chat, voice, or direct ActiveSoft occurrence automation. Those are later layers after the data model, review workflow, and external integration proof exist.

## Top Five Priorities

### 1. Establish The Clara Domain Model And Access Boundaries

Why it is first: the current repository has auth and SaaS scaffolding, but no school/classroom domain model. Without the domain model, every UI and integration decision is floating.

Build:

- School, term, class, subject, teacher assignment, student, enrollment.
- Lesson session with date, schedule, status, teacher, class, and subject.
- Attendance record with presence status and source.
- Pedagogical event with type, axis/code, severity suggestion, sensitivity flag, and review requirement.
- Event participant table that separates registered student, involved student, witness, and hidden-in-text participant.
- Individual student record with separate raw, normalized, ActiveSoft draft, family draft, approved ActiveSoft text, and approved family text fields.
- Audit log for create/edit/review/approve/export/launch actions.

Acceptance gates:

- No Clara workflow stores only a free-text blob.
- Every official output has a raw-source pointer and reviewer state.
- Tests prove individual records generated from batch events do not include names of other students.
- Role checks separate teacher, coordination, direction, and system/admin actions.

### 2. Build Teacher Class Mode For Attendance And Homework

Why it is second: the PRD success metric is speed in the live classroom. This should be proven before heavier AI work.

Build:

- Today's classes view.
- Start class action.
- Attendance list with "all present" and per-student status.
- Homework prompt: all completed, some missing, no homework, skip.
- Batch selection for missing homework/material.
- Template-based individual record generation.
- Mobile-first PWA layout for teacher use.

Acceptance gates:

- Attendance can be recorded in under 60 seconds in pilot testing.
- Five students missing homework can be recorded in under 30 seconds.
- The teacher can finish the flow without seeing internal A/B/C axis codes.
- The workflow works on a phone-width viewport without hidden critical actions.

### 3. Build Coordination Review And Safety Gates

Why it is third: the product value is not just faster capture; it is safer institutional text before the record becomes official.

Build:

- Review queue with statuses: draft, suggested, awaiting review, approved for ActiveSoft, launched in ActiveSoft, released to family, returned, archived.
- Coordinator edit/approve/return/archive actions.
- Sensitive-case routing rules.
- "Exibir na internet" default false and sensitive-case lockout.
- Review history and immutable audit entries.

Acceptance gates:

- Raw teacher note, normalized internal summary, approved ActiveSoft observation, and approved family message are separate fields.
- No sensitive case can be launched or family-visible without coordinator approval.
- Every approval records who approved, when, and what text was approved.
- Review queue filters by class, student, type, severity, status, and date.

### 4. Add Controlled AI Only After Deterministic Workflow Exists

Why it is fourth: AI can improve language quality, but it must not become the workflow owner.

Build:

- Text improvement service that preserves facts and returns structured output.
- Safety checks for prohibited wording, invented facts, other-student names, sensitive categories, and missing reviewer gates.
- Suggested axis/code/severity with confidence and explanation.
- Human confirmation before any generated text leaves draft state.
- Prompt/version logging for generated suggestions.

Acceptance gates:

- AI output cannot create an approved record directly.
- Tests cover "do not invent motive, diagnosis, intent, punishment, recurrence, or unreported details."
- Tests cover "do not include another student's name in the individual record."
- Low-confidence or sensitive suggestions route to required review.

### 5. Ship Assisted ActiveSoft Launch Before API Automation

Why it is fifth: public ActiveSoft docs support API/token and frequency records, but do not publicly confirm occurrence creation by API. Building automatic occurrence sync first would be an assumption.

Build:

- Assisted launch queue that displays approved ActiveSoft text for coordinator copy/launch.
- ActiveSoft occurrence type mapping table.
- Launch checklist with "Exibir na internet" default false.
- Launch result logging: launched by, launched at, ActiveSoft reference if available, or manual confirmation.
- Integration evidence packet for the school/ActiveSoft: required permissions, sample payloads, rate limits, audit behavior, sandbox proof.

Acceptance gates:

- MVP works without ActiveSoft occurrence API automation.
- Frequency API integration remains separately feature-flagged and only uses documented/validated frequency endpoints.
- Occurrence API automation remains disabled until official documentation and sandbox proof are attached to the integration record.
- Failed or partial launches are visible to coordination and cannot silently mark records as official.

## Sequenced Roadmap

### Phase 0: Governance And Setup

Outcome: the team knows what is real, what is assumed, and what is blocked.

- Keep `prd.md` as the working product PRD.
- Use this roadmap as the engineering execution order.
- Keep ADRs current when product safety, data boundaries, integration automation, or deployment architecture changes.
- Replace remaining starter-kit docs only as they become relevant to Clara work.

### Phase 1: Classroom MVP Without Heavy AI

Outcome: teachers can run the core classroom routine.

- Domain schema and migrations.
- Teacher class mode.
- Attendance.
- Homework/material batch capture.
- Template-generated individual records.
- Basic coordination review queue.
- Assisted ActiveSoft copy/launch.

### Phase 2: Review-Quality MVP

Outcome: coordination can trust the queue and audit trail.

- Status transitions.
- Sensitivity rules.
- Approved text separation.
- Family visibility controls.
- Audit log and operational reports.
- Pilot metrics dashboard.

### Phase 3: Controlled AI

Outcome: Clara improves text quality without bypassing human review.

- Text cleanup suggestions.
- Axis/code/severity suggestions.
- Name leakage detection.
- Sensitive-case detection.
- Prompt/version audit.

### Phase 4: Voice And Optional WhatsApp

Outcome: alternate capture channels remain subordinate to the same review model.

- PWA voice capture with confirmation.
- Retention policy for audio/transcripts.
- WhatsApp only as an optional input channel.
- No automatic publication from chat or voice.

### Phase 5: ActiveSoft Automation

Outcome: automation only after verified external contract.

- Confirm token permissions and endpoint documentation.
- Validate sandbox payloads.
- Build adapter behind feature flags.
- Add retry/idempotency/audit.
- Run parallel manual-vs-automated reconciliation before enabling production writes.

## Immediate Next Steps

1. Confirm the pilot school, classes, teachers, and coordination reviewers.
2. Get formal ActiveSoft API/token documentation from the school's admin account or ActiveSoft support.
3. Design and migrate the Clara domain schema.
4. Replace the generic dashboard with teacher class mode and coordination review surfaces.
5. Add tests for privacy, review gating, and batch-to-individual record generation before adding AI.
