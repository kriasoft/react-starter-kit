# Clara Product Brief

Last reviewed: 2026-05-19

Clara is a guided classroom routine assistant for attendance, homework follow-up, pedagogical event capture, coordination review, and assisted launch into ActiveSoft. ActiveSoft remains the official school record system; Clara is the fast capture and quality-control layer before anything becomes official history.

## Current State

The repository is a strong technical foundation, but it is still mostly a starter SaaS application.

What exists:

- Monorepo with React SPA, Astro marketing site, Hono/tRPC API, Better Auth, Drizzle, Neon PostgreSQL, React Email, and Cloudflare Workers.
- Clara name and first-pass product copy in the app shell, marketing home, PRD, email templates, API metadata, and worker names.
- Authentication, organizations, billing scaffolding, email templates, build/test/lint/typecheck pipeline.
- PRD draft at the repository root: `prd.md`.
- One pre-existing ADR for the auth hint cookie.

What does not exist yet:

- Clara domain schema for schools, teachers, classes, students, lessons, attendance, homework checks, pedagogical events, individual records, review states, and ActiveSoft launch logs.
- Clara-specific API procedures and route contracts.
- Teacher "class mode" workflow.
- Coordination review queue.
- ActiveSoft integration adapter or manual launch queue.
- Privacy, retention, audit, and AI-safety tests for student records.
- A validated ActiveSoft sandbox/token/payload contract from the school or ActiveSoft.

## Product Invariants

- ActiveSoft is the system of record.
- Clara must not send raw teacher text, audio, or literal transcription into ActiveSoft.
- "Exibir na internet" is off by default and blocked for sensitive cases unless coordination explicitly approves.
- Every official or family-visible output must come from an approved text field, not a raw capture field.
- Events created in batch must still produce individual student records.
- Individual student records must not cite other students by name.
- Sensitive cases require human review before ActiveSoft launch or family visibility.
- Integration automation is gated by official ActiveSoft documentation, token permissions, sandbox proof, and audit logging.

## Evidence From Current ActiveSoft Public Docs

Public ActiveSoft documentation confirms that:

- ActiveSoft has API/token access managed from the administrative "Acesso via API" area, with partner permissions and token validity.
- ActiveSoft documents a frequency write endpoint, `api/v1/marcar_frequencia_aluno/`, and says partners should use it for sending frequency records.
- ActiveSoft Portal Web for teachers supports frequency, occurrence entry, and batch occurrence creation through the portal UI.
- Occurrence types can be classified as Pedagogical, Disciplinary, Financial, or Psychological, and can be made available to the teacher portal and specific profiles.

Public docs reviewed do not confirm a public occurrence-creation API endpoint. Treat occurrence automation as blocked until the school or ActiveSoft provides official API documentation, token permissions, test credentials, payload examples, and sandbox/audit proof.

Sources:

- [ActiveSoft API frequency article](https://ajuda.activesoft.com.br/hc/pt-br/articles/37465274198548-Inconsist%C3%AAncia-na-integra%C3%A7%C3%A3o-da-API-Registros-de-frequ%C3%AAncias)
- [ActiveSoft API token article](https://ajuda.activesoft.com.br/hc/pt-br/articles/33632998814356-Integra%C3%A7%C3%A3o-de-cadastros-com-APP-parceiros-da-Activesoft)
- [ActiveSoft teacher portal article](https://ajuda.activesoft.com.br/hc/pt-br/articles/33629893508756-Como-funciona-o-Portal-Web-para-Professores)
- [ActiveSoft occurrence type article](https://ajuda.activesoft.com.br/hc/pt-br/articles/33526476870676-Criando-e-gerenciando-os-tipos-de-ocorr%C3%AAncia)
- [ActiveSoft occurrence module article](https://ajuda.activesoft.com.br/hc/pt-br/articles/33622747562388-Acesso-as-ocorr%C3%AAncias-de-alunos)

## Go/No-Go Rule

The next implementation phase should start only after the team accepts the top-five priorities in the roadmap and agrees that the first release is not an AI chatbot. The first release is a guided PWA workflow with review gates and assisted ActiveSoft launch.
