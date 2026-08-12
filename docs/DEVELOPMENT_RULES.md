# OrgAudit - Development Rules and Definition of Done

## Source-of-truth order

1. Explicit user-approved decisions recorded in `docs/REQUIREMENTS.md`.
2. Security/RLS design and domain/schema plan.
3. Existing architecture/context and approved report template.
4. Existing code and generated types.

If a source conflicts, do not silently choose the easier implementation. Document the contradiction, preserve user-approved behavior, and propose a narrowly scoped decision record.

## Non-negotiable rules

- Do not implement Attachment A/B collection or collectible features in OrgAudit.
- Use UUID strings; never coerce a UUID to a number.
- Make every organization-owned query tenant-scoped. RLS, not client role checks, is the final authorization boundary.
- Never expose `SUPABASE_SERVICE_ROLE_KEY`, credentials, passwords, or signed storage URLs in browser bundles/logs.
- Financial source facts cannot be hard-deleted. Corrections require reasoned revisions; voiding requires reason.
- Do not model bank/cash transfers as income or expense.
- Use database-backed atomic voucher allocation; never calculate voucher values with application-side `MAX()+1`.
- Create a migration for every database change; review generated SQL, apply it to an isolated database, then regenerate TypeScript types.
- Do not weaken RLS, use a client-provided role/org ID for authorization, or add a broad policy simply to unblock development.
- Keep report snapshots and signatures immutable. A change means a new Attachment C version.
- Avoid receipt/file-upload features and unapproved dependencies.

## Engineering conventions

- Use `numeric(14,2)` for money, `date` for accounting dates, and `timestamptz` for audit timestamps.
- Keep business rules in validated server/RPC boundaries, not React components. Validate all server input with typed schemas.
- Prefer explicit domain names (`attachment_c_report_versions`, `fund_transfers`) over ambiguous generic names.
- Keep presentation configuration separate from financial data.
- Make error messages safe for users; log diagnostic detail without secrets or financial data beyond what operations need.
- Keep changes focused; do not reformat unrelated files or redesign locked architecture while doing a feature.

## Definition of Done

A change is done only when it:

1. Meets a stated requirement and acceptance condition.
2. Uses an approved migration and preserves data integrity.
3. Includes or updates appropriate tests, including negative tenant/RLS tests for security-sensitive work.
4. Passes typecheck, lint, and relevant automated tests.
5. Verifies report layout visually when changing PDF generation.
6. Updates the relevant planning document/decision record and generated types when applicable.
7. Leaves no secrets, debug bypasses, unrelated edits, or untracked data artifacts.
