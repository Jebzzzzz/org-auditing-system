<!-- BEGIN:nextjs-agent-rules -->

# OrgAudit Agent Instructions

## Mission

Build OrgAudit as the VSU-only, multi-organization financial-accountability system described in `docs/REQUIREMENTS.md`. Do not implement Attachment A/B source workflows or begin a feature without the relevant approved plan.

## Read first

Before work, read the relevant files in this order:

1. `docs/REQUIREMENTS.md`
2. `docs/DOMAIN_MODEL_AND_SCHEMA_PLAN.md` for data work
3. `docs/AUTH_AND_RBAC.md` and `docs/SUPABASE_RLS_SECURITY.md` for authentication, authorization, storage, or database work
4. `docs/TESTING.md` and `docs/DEVELOPMENT_RULES.md`
5. The affected code, migrations, and generated types

User-approved requirements override earlier architecture/context files. Surface a contradiction rather than silently changing a locked decision.

## Guardrails

- Treat Supabase RLS as the final authorization boundary. Never rely only on UI/client role checks.
- Derive actor, organization, and role from authenticated server/database context; never trust client-provided authorization fields.
- All organization-owned data must stay tenant-isolated. Write cross-organization negative tests for every RLS or financial mutation change.
- Never hard-delete financial records; use revision or void workflows with mandatory reasons.
- Model internal fund movements as `fund_transfers`, not income/expense.
- Keep Attachment C snapshots and signatures immutable; generate a new version after source changes.
- Use UUID strings, atomic voucher allocation, database migrations, regenerated types, and server/RPC validation.
- Never expose service-role keys, passwords, access tokens, or private report objects.
- Do not introduce new dependencies, schemas, roles, report rules, or product scope without explaining why and obtaining approval when it changes a frozen decision.

## Working method

1. Inspect existing code and relevant docs before editing.
2. State assumptions and identify affected requirements.
3. Make the smallest coherent change.
4. Add/update tests and run the required checks.
5. Summarize changed files, verification, and any follow-up decision needed.

## Completion bar

Follow `docs/DEVELOPMENT_RULES.md` Definition of Done. Do not claim completion if tests, RLS verification, migration validation, or required report-render review have not been performed.


<!-- END:nextjs-agent-rules -->
