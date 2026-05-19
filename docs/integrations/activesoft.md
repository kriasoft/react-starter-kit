# ActiveSoft Integration Boundary

Last reviewed: 2026-05-19

This document records what has been verified from public ActiveSoft material and what must remain blocked until the school or ActiveSoft provides official API access and documentation.

## Confirmed Publicly

ActiveSoft has API support, but access is permissioned through administrative token configuration. The public help article for partner app cadastro integration describes generating a token from `Administrativo > Configuracoes > Controle de acesso > Acesso via API`, selecting partner permissions, setting validity, and accessing API documentation from that same area.

ActiveSoft publicly documents frequency API behavior. The frequency troubleshooting article identifies `api/v1/marcar_frequencia_aluno/` as the correct endpoint for sending frequency records and `api/v1/listar_frequencia_aluno/?aluno_id=` as a consultation endpoint.

ActiveSoft Portal Web for teachers supports:

- Viewing teacher-linked classes.
- Frequency in batch.
- Student occurrences individually or in batch.
- Occurrence fields including date, occurrence type, observation, and the optional `Exibir na internet` flag.

ActiveSoft occurrence configuration supports:

- Occurrence type name.
- Category: Pedagogical, Disciplinary, Financial, or Psychological.
- Active flag.
- Teacher portal availability.
- Profile-based availability.

ActiveSoft occurrence management supports:

- Filtering by type, situation, date, class, and student situation.
- Audit/history inspection.
- Editing, deleting, details, messaging, and batch operations.

Sources:

- [ActiveSoft API section](https://ajuda.activesoft.com.br/hc/pt-br/sections/33632944480276-API)
- [ActiveSoft API token article](https://ajuda.activesoft.com.br/hc/pt-br/articles/33632998814356-Integra%C3%A7%C3%A3o-de-cadastros-com-APP-parceiros-da-Activesoft)
- [ActiveSoft frequency API article](https://ajuda.activesoft.com.br/hc/pt-br/articles/37465274198548-Inconsist%C3%AAncia-na-integra%C3%A7%C3%A3o-da-API-Registros-de-frequ%C3%AAncias)
- [ActiveSoft teacher portal article](https://ajuda.activesoft.com.br/hc/pt-br/articles/33629893508756-Como-funciona-o-Portal-Web-para-Professores)
- [ActiveSoft occurrence type article](https://ajuda.activesoft.com.br/hc/pt-br/articles/33526476870676-Criando-e-gerenciando-os-tipos-de-ocorr%C3%AAncia)
- [ActiveSoft occurrence module article](https://ajuda.activesoft.com.br/hc/pt-br/articles/33622747562388-Acesso-as-ocorr%C3%AAncias-de-alunos)

## Not Confirmed Publicly

The reviewed public material does not confirm an API endpoint for creating student occurrences. The product must not assume occurrence creation can be automated.

The reviewed public material also does not provide:

- Request/response schemas for occurrence creation.
- Required token permissions for occurrence writes.
- Rate limits.
- Idempotency behavior.
- Sandbox/test environment details.
- Whether `Exibir na internet` can be controlled through an occurrence API payload.
- Whether occurrence writes expose an external reference ID suitable for reconciliation.

## MVP Decision

The MVP launches with assisted ActiveSoft handoff:

1. Clara stores raw teacher input separately from approved text.
2. Coordination approves the ActiveSoft-ready observation.
3. Clara displays the approved text and occurrence mapping for manual launch.
4. Coordination launches in ActiveSoft and records the result in Clara.

Automatic occurrence writes remain disabled until official endpoint documentation and sandbox proof exist.

## Required Evidence Before Automation

Before enabling any automated write into ActiveSoft, attach evidence for:

- School-approved API token and permission list.
- Official endpoint documentation.
- Sandbox or non-production test tenant.
- Sample create/update/failure payloads.
- Mapping between Clara internal event types and ActiveSoft occurrence type IDs.
- Behavior of `Exibir na internet`.
- Audit log behavior in ActiveSoft.
- Rate limits and retry policy.
- Idempotency key or duplicate prevention strategy.
- Data-processing approval from the school for student data handled by Clara.

## Implementation Rules

- Keep `ActiveSoft` writes behind a feature flag.
- Keep frequency integration separate from occurrence integration.
- Never reuse a frequency endpoint for occurrence records.
- Never send raw teacher text, audio, literal transcript, or unreviewed AI output.
- Default `Exibir na internet` to false.
- Block family visibility for sensitive cases until coordination explicitly approves.
- Log every launch attempt, result, actor, timestamp, payload version, and external reference when available.
