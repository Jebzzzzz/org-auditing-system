# OrgAudit - Implementation Roadmap

**Planning-only roadmap.** This sequence begins after the documents in this package are accepted; it does not authorize feature implementation today.

## Phase 0 - Planning baseline (complete with this package)

- Freeze requirements, scope, domain model, RBAC/RLS design, tests, development rules, and agent instructions.
- Preserve the original uploads as project source material when they become available in the repository.
- Record any future requirement change as a dated decision before implementation.

## Phase 1 - Technical and security foundation

- Establish the Next.js + Supabase local development environment, CI quality gates, environment-secret handling, and migrations directory.
- Implement seeded VSU faculty/department catalogs, organization provisioning, position accounts, profiles, and historical position holders.
- Add System Admin, safe identity helper functions, base RLS, server/RPC authorization boundary, and baseline cross-organization tests.
- Exit criteria: an authenticated account resolves correctly to a single active position; tenant isolation is proven for all base tables.

## Phase 2 - Period and ledger integrity

- Implement academic periods, manual opening balances, voucher allocator, categories, events, transactions, revisions/voiding, and transfers.
- Implement derived balance queries and period-state enforcement.
- Exit criteria: all accounting constraints and concurrent voucher tests pass; President mutation attempts fail; no direct financial-table client writes are possible.

## Phase 3 - Handover and auditability

- Implement officer-initiated handover requests, Super-Admin approval/completion, session/password-reset integration, append-only audit events, and historical attribution.
- Exit criteria: turnover preserves history, prevents double-active positions, and immediately removes former-holder authorization.

## Phase 4 - Dashboard and exports

- Build organization-scoped ledger views, balance dashboard/analytics, transaction-revision views, historical period access, and CSV exports.
- Exit criteria: calculations match approved fixtures; exports are scoped and authorization-tested.

## Phase 5 - Attachment C reporting

- Implement report snapshot query, event/Miscellaneous grouping, template configuration, PDF rendering, private storage, versions, role-bound signatures, and authorized downloads.
- Render/inspect representative PDFs against `ATTACHMENT-C.pdf` content structure.
- Exit criteria: Version 1 remains unchanged after a source correction; Version 2 requires fresh signatures; visual layout is verified.

## Phase 6 - Production readiness

- Complete performance/index review, backup and restore exercise, monitoring/audit access runbook, rate limits, accessibility review, error handling, security review, and pilot data migration/import plan if needed.
- Train Super-Admin on provisioning, support, emergency access, turnover completion, and report recovery.
- Exit criteria: release checklist, rollback plan, RLS test suite, migration upgrade test, and operational handoff are approved.

## Cross-phase gates

| Gate | Required evidence |
|---|---|
| Data change | Reviewed migration, constraints, generated types, database tests. |
| Security change | Positive/negative RLS and RPC tests across two organizations. |
| Financial change | Revision/void/balance behavior and regression fixtures. |
| Report change | Snapshot/version tests plus rendered visual inspection. |
| Release | Backup/restore evidence, alerting/runbook, and production-secret review. |
