# OrgAudit - Supabase RLS and Security Design

## Security model

Supabase Auth authenticates the reusable position account. Database authorization resolves that account to its active organization position and role; it never trusts a browser-supplied organization ID or role. RLS protects every exposed table, while security-definer mutation functions provide the controlled write path for financial facts.

## Identity bootstrap without recursive RLS

Do not implement `auth.org_id()` or `auth.role_name()` by querying RLS-protected `positions` from a policy on `positions`; that can recurse. Put internal helper functions in a non-exposed schema such as `private` and make them `security definer`, `stable`, with an explicit safe `search_path`, minimal grants, and no arbitrary input.

Minimum helpers:

- `private.is_system_admin()` -> boolean
- `private.active_position()` -> `(position_id, organization_id, role, position_holder_id)` or no row
- `private.can_write_finance(org_id, period_id)` -> boolean
- `private.is_same_org(org_id)` -> boolean

Functions read only the necessary identity tables under their owner privileges. Revoke execute from `anon`; grant only to `authenticated` where a policy or approved RPC needs it. Never expose these helpers through PostgREST.

## Table policy pattern

| Table class | Select | Insert/update/delete |
|---|---|---|
| `faculties`, `departments` | Authenticated read | No organization-user writes; provisioning path only. |
| `organizations` | Current organization; bounded admin provisioning view | Super-Admin provisioning function only. |
| `profiles` | Self and approved same-organization holder history needed for attribution | Self-service limited profile fields through RPC; Super-Admin provisioning. |
| `positions`, `position_holders` | Current organization only; Super-Admin supports all | No direct officer mutation. Handover completion RPC only. |
| `handover_requests` | Initiator/current-org visibility; Super-Admin all | Officers create/cancel eligible own-org requests; admin approves/completes/rejects through RPC. |
| `academic_periods` | Authenticated read | Super-Admin controlled. |
| `categories`, `events` | Same organization | Financial-writer RPC only when period is open. |
| opening balances, transactions, revisions, transfers | Same organization | Direct table DML denied to ordinary clients; approved financial RPCs only. |
| Attachment C report series, versions, signatures | Same organization | Generate/sign RPCs only; version snapshot and signatures immutable. |
| `audit_log`, `voucher_sequences` | Same-org limited audit projection / no raw sequence need | Direct client DML denied. |

For same-organization policies, use `private.is_same_org(organization_id)` in both `USING` and `WITH CHECK`. A select policy never implies insert/update permission. Tables with no direct client write must have RLS enabled plus no permissive mutation policy.

## Mutation RPC boundary

Expose narrowly named functions such as `create_transaction`, `revise_transaction`, `void_transaction`, `set_opening_balance`, `create_fund_transfer`, `initiate_handover`, `generate_attachment_c_version`, and `sign_attachment_c_version`.

Each function must:

1. Derive actor and organization from `auth.uid()`; ignore client actor/organization fields.
2. Validate UUIDs, amounts, enums, period state, role, and related tenant ownership.
3. Allocate vouchers under row lock when creating transactions.
4. Write the target fact, business revision where applicable, and append-only audit event in one database transaction.
5. Return only the allowed organization-scoped result.

Use `SECURITY DEFINER` only where needed, pin `search_path`, qualify table names, revoke default execute, and never make a generic “run SQL” or arbitrary-table audit function. The service-role key is reserved for server-side operational work and is never shipped to the browser.

## Immutability controls

- Block `DELETE` on financial, revision, report-version, signature, and audit tables for application roles.
- A transaction update route must call `revise_transaction`; it checks the change reason and inserts the immutable old/new snapshot. A void route keeps the original record and requires a reason.
- Once a report version is created, prohibit UPDATE/DELETE of its snapshot/PDF/hash/signatures. Later source-data changes produce a new version.
- Audit-log and revision rows are append-only. Enforce this with privileges/RLS and a trigger that rejects UPDATE/DELETE except a separately governed database-maintenance role.

## Storage and export

Only generated Attachment C PDFs use Storage. Use a private bucket and object keys beginning with `organization_id/report_id/version_id`. Do not permit browser-crafted cross-organization object paths; generate signed download URLs only after a server/RPC authorization check. CSV exports are generated from scoped queries and streamed/downloaded without public storage unless later required.

## Operational safeguards

- Enforce TLS, Supabase Auth email verification/password-reset flows, and server-only secrets.
- Rate-limit sign-in, mutation, report generation, and export endpoints at the application/edge layer.
- Log authorization denials and sensitive mutations without passwords, tokens, or raw credential-reset links.
- Use migration review, backup/restore testing, least-privilege database roles, and an emergency-access runbook. Emergency access must produce an audit record.
- Treat privileged Supabase dashboard/service-role access as production administration, separate from ordinary app behavior.

## Required security tests

Every policy/RPC change needs positive and negative tests for Treasurer, Auditor, President, and Super-Admin, with at least two organizations. Prove cross-tenant reads, writes, report downloads, foreign-key mixing, direct financial DML, and forged signer/actor IDs are denied.
