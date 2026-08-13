<!-- BEGIN:nextjs-agent-rules -->

# OrgAudit Agent Instructions

## Mission and authority

Build **OrgAudit** as the VSU-only, multi-organization financial-accountability system defined by the approved project documentation. The application manages organization financial records and generates **Attachment C — Organization Expenses**.

Do **not** implement Attachment A or Attachment B collection/receivable workflows, receipt uploads, unapproved roles, new report rules, or unrelated product scope.

When sources disagree, use this authority order:

1. Explicit user-approved decisions recorded in `docs/REQUIREMENTS.md`
2. The focused specification documents in `docs/`
3. `docs/ARCHITECTURE.md`
4. Existing implementation

Do not silently reinterpret a frozen decision. Describe the contradiction, its effect, and the smallest viable resolution before changing the affected design.

## Read before changing anything

Read the relevant files in this order before editing:

1. `docs/REQUIREMENTS.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DOMAIN_MODEL_AND_SCHEMA_PLAN.md` for data or report work
4. `docs/AUTH_AND_RBAC.md` and `docs/SUPABASE_RLS_SECURITY.md` for authentication, authorization, storage, or database work
5. `docs/TESTING.md` and `docs/DEVELOPMENT_RULES.md`
6. The affected code, Supabase migrations, database tests, and generated types

User-approved requirements always override older architecture or context files.

## Required repository structure

Keep the repository organized around this structure. Do not create parallel `lib/actions`, `lib/services`, `lib/usecases`, or generic `components/` folders outside it.

```text
app/
  (auth)/                    # Login and recovery routes
  dashboard/                 # Analytics and liquidity overview
  transactions/              # Ledger, revision, and void flows
  transfers/                 # Internal fund movements
  opening-balances/          # Semester opening-balance setup
  events/                    # Activities and projects
  reports/                   # Attachment C and CSV exports
  settings/                  # Profile, position, turnover initiation
  admin/                     # Super-admin workspace
  layout.tsx
  page.tsx
  proxy.ts                   # Route/session protection

components/
  atoms/                     # Small presentational primitives
  molecules/                 # Small composed controls
  organisms/                 # Feature-level UI assemblies
  templates/                 # Page-layout compositions
  ui/                        # Reusable primitive-library components

utils/
  supabase/
    client.ts                # Browser client only
    server.ts                # Server Component / Action client
    middleware.ts            # Shared session-refresh helper for proxy

lib/
  domain/
    actions/                 # Server Action entry points
    services/                # Authorization-aware orchestration
    usecases/                # Single-purpose Supabase/RPC operations
  entities/                  # Generated database types and domain types
  validation/                # Zod schemas and input parsing
  constants/                 # Roles, labels, fixed domain constants
  utils.ts                   # Small framework-independent helpers

supabase/
  migrations/                # Ordered, append-only SQL migrations
  tests/                     # SQL/RLS/RPC tests
  seed.sql                   # Safe development seed data only

docs/                        # Approved plans and operating rules
```

Place code by responsibility, not by the page that currently uses it. A component may call a passed callback, but it must not contain financial authorization rules, direct database mutations, or report business logic.

## Mandatory request flow

Use this direction for every protected read or write:

```text
Atomic Design UI
  -> Server Action
  -> Domain Service
  -> Use Case
  -> Supabase RPC or RLS-scoped query
```

- **Components** render state and collect user input. They do not authorize an actor or call privileged database operations.
- **Server Actions** in `lib/domain/actions/` are the only mutation entry points from the web UI. They use `'use server'`, validate input, invoke one service, and return a typed result suitable for the UI.
- **Services** in `lib/domain/services/` coordinate the business operation, enforce application-level workflow rules, and select the appropriate use cases. A service does not accept an untrusted actor, organization, or role as authority.
- **Use cases** in `lib/domain/usecases/` perform one focused database/auth operation through a server-side Supabase client: for example, load the active position, call `create_expense_transaction`, or fetch Attachment C data.
- **Supabase** remains the final enforcement boundary through RLS policies and controlled RPC functions.

Do not bypass a lower layer merely because a page is simple. Do not import server-only domain modules into a Client Component.

## Next.js and component rules

- Use the App Router. Pages and layouts are Server Components by default.
- Add `'use client'` only for a component that actually needs browser state, event handlers, or browser APIs. Keep the client boundary as low in the component tree as practical.
- Keep page route files thin: compose templates/organisms, load read data safely, and pass only the data and callbacks they need.
- Use `app/proxy.ts` and the Supabase middleware helper for route/session handling. Proxy protection improves navigation; it is not authorization.
- Validate every external input with the relevant schema in `lib/validation/`. Client-side validation is a usability feature, never the security boundary.
- Keep rendering and formatting helpers pure. Use `lib/utils.ts` only for small, framework-independent utilities.
- Use generated database types from `lib/entities/`; use UUIDs as strings. Never convert UUIDs with `Number()`.

## Server Action AAA contract

Every protected Server Action must make these checks explicit before any mutation:

1. **Authentication** — obtain the authenticated user from the server-side Supabase context.
2. **Authorization** — load the active position, organization membership, role, and required academic period server-side. Never trust client-provided `user_id`, `organization_id`, `role`, or permission flags.
3. **Audit context** — ensure the controlled database operation receives or derives the authenticated actor and writes the canonical audit/revision history.

The database RPC must independently derive the actor from `auth.uid()` and enforce the same authorization through RLS/RPC checks. Server Actions and services add clarity and workflow control; neither replaces database security.

## Supabase, migrations, and security

OrgAudit uses **hosted Supabase** with Vercel. Docker is not required and must not be introduced for normal development.

- Use append-only SQL migrations in `supabase/migrations/`; never edit an already-applied production migration.
- Before schema changes, inspect the approved domain/schema plan and existing migrations.
- Use the hosted migration workflow: create a migration, review it, run `supabase db push --dry-run`, then apply it only to the intended linked project. Regenerate database types after schema changes.
- Never run `supabase start` for this project, and never run `supabase db reset --linked`.
- Enable RLS on every application table. Treat RLS as the final tenant and permission boundary.
- Use private helper functions with a fixed `search_path` for position/organization checks. Keep direct table access tightly scoped; use security-definer RPCs only when necessary and with explicit authorization checks.
- Never use the service-role key in browser code, expose it to logs, or send it to a client. Do not expose passwords, access tokens, or private report-object paths.
- Keep Attachment C PDFs in a private storage bucket and access them through authenticated, scoped server flows or short-lived signed URLs.
- For financial writes, prefer controlled RPCs. Do not allow browser-side direct inserts, updates, or deletes against financial tables.

## Authorization and tenant isolation

Roles are fixed unless the user approves a change:

- **Super Admin** manages organizations and completes turnover; it is a platform role, not an organization officer position.
- **Treasurer** and **Auditor** can create and revise permitted source financial records.
- **President** can view, generate, export, and sign reports, but cannot mutate financial source records.

Enforce all organization boundaries from server/database identity. A signed-in person can never read, mutate, export, or sign data outside the organization and authority they currently hold.

For every RLS-policy, RPC, or financial-mutation change, add a cross-organization negative test proving that an actor from Organization A cannot access Organization B data.

## Financial integrity rules

These rules are non-negotiable:

- Financial records are never hard-deleted.
- Editing a financial transaction creates an immutable revision with a required reason.
- Voiding a transaction requires a reason and preserves the original record and audit trail.
- Internal fund movements are represented only by `fund_transfers`; they are not income or expense and must not change total liquidity.
- Opening balances are entered manually for each organization, academic year, semester, and fund.
- Voucher numbers use `YYYY-YYYY-0001`, reset per organization and academic year, and are allocated atomically in the database.
- An officer cannot hold two active officer positions at once. Turnover follows the approved initiate/complete workflow.
- Historical records remain retained and read-only; there is no automatic purge.

## Attachment C rules

Attachment C is the only report-generation scope currently approved.

- Select organization, academic year, and semester.
- Include posted expense transactions for that organization and period.
- An expense linked to an event belongs in that event section; one without an event belongs in **Miscellaneous**. Do not create a fake event.
- The summary section displays `events.start_date`; detailed rows display the individual transaction date.
- Report snapshots, signatures, and generated files are immutable. If source data changes, generate a new report version with fresh signatures.
- Signatures may occur in any approved order, but only authorized active officers may sign.
- Attachment A and B data generation, student collection tracking, and receivables are out of scope.

## Testing and verification

Follow `docs/TESTING.md` and the Definition of Done in `docs/DEVELOPMENT_RULES.md`.

At the appropriate level, test:

- Validation, calculations, grouping, and formatting helpers.
- Services, including role and period workflow decisions.
- RLS policies, RPC authorization, tenant-isolation negative cases, voucher concurrency, revisions, voids, and transfers.
- Server Action behavior and important user flows.
- Attachment C data grouping, totals, immutable versioning, authorization, and rendered PDF layout when report output changes.

Do not claim a task is complete if required tests, migration validation, RLS verification, type regeneration, or report-render review was skipped. State exactly what was run and what could not be verified.

## Working method

For every task:

1. Inspect the required documentation and affected implementation first.
2. State the affected requirements and any assumption that is not explicitly decided.
3. Make the smallest coherent change in the required layer and folder.
4. Update migrations, generated types, tests, and documentation when the change requires them.
5. Run the required checks and inspect the result.
6. Summarize changed files, verification performed, and any remaining user decision.

Do not add dependencies, database tables, roles, report behavior, or product scope merely for convenience. Explain the need and obtain approval if it would alter a frozen decision.

## Completion bar

Work is complete only when it meets `docs/DEVELOPMENT_RULES.md`, preserves the architecture above, and has the evidence required by `docs/TESTING.md`. If a required check cannot run, report that limitation clearly instead of declaring success.


<!-- END:nextjs-agent-rules -->
