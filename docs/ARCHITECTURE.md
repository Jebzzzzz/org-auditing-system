# Student Organization Audit & Financial Management System

An audit-ready, lightweight VSU-only financial tracking and Attachment C reporting platform built with **Next.js** and **Supabase**. OrgAudit replaces fragmented spreadsheets and paper trails with a structured, tenant-isolated ledger that preserves financial accountability across officer turnover.

> Revision note: This copy preserves the original architecture's nine-section structure while updating only requirements that conflict with the approved OrgAudit specification.

---

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. User Roles & Access Control](#2-user-roles--access-control)
- [3. System Architecture & Routes](#3-system-architecture--routes)
- [4. Database Schema Specification](#4-database-schema-specification)
- [5. Data Lifecycle & Retention Policy](#5-data-lifecycle--retention-policy)
- [6. Technical Architecture & Code Structure](#6-technical-architecture--code-structure)
  - [Tech Stack](#tech-stack)
  - [Repository Layout](#repository-layout)
  - [Supabase Setup & Request Flow](#supabase-setup--request-flow)
- [7. Getting Started & Local Development](#7-getting-started--local-development)
  - [Environment Setup](#environment-setup)
  - [Supabase CLI Operations](#supabase-cli-operations)
- [8. Standard Workflows & Adding New Features](#8-standard-workflows--adding-new-features)
- [9. Code Samples & Implementation Guide](#9-code-samples--implementation-guide)

---

## 1. Executive Summary

OrgAudit addresses financial transparency and officer turnover for Visayas State University student organizations. Position accounts authenticate officers, while human office holders are retained separately so transactions, revisions, and signatures keep their correct historical attribution.

### Key Features

- **Dual Liquidity Tracking:** Separate Bank and Cash-on-Hand balances plus derived total liquidity.
- **Semester Ledger:** Manual opening balances, income/expense transactions, events, categories, vouchers, revisions, voids, and fund transfers.
- **Audit-Ready History:** Financial records are never hard-deleted. Every edit has a required reason and immutable revision evidence.
- **Position-Based Governance:** Treasurer and Auditor write financial source data; President reads/reviews and may generate/export/sign reports; Super-Admin provisions and completes turnover.
- **Attachment C Reports:** Semester expense schedules are immutable report snapshots with versions and role-bound signatures.
- **Historical Retention:** Closed/archived periods remain read-only and exportable; records are not purged merely to reduce storage.
- **No Mandatory Receipt Upload:** Receipt upload is outside the approved project scope. Storage is for generated private Attachment C PDFs only.

### Project Boundary

| In scope | Out of scope |
|---|---|
| Ledger, balances, transfers, events, revisions, dashboard, CSV, Attachment C | Attachment A source data |
| Position accounts, holder history, handover, RLS, audit log | Attachment B source data |
| VSU catalog and organization provisioning | Student receivables, receipt uploads, general report engine |

---

## 2. User Roles & Access Control

### Operational Model

A reusable Supabase Auth account belongs to a Treasurer, Auditor, or President position. `profiles` identifies a person; `positions` identifies a role in an organization; `position_holders` preserves the person's time-bounded tenure. A person may have history but cannot hold two active positions.

| Role | Access Level | Primary Responsibilities |
|---|---|---|
| **Super-Admin** | Platform administration | Creates organizations and initial position accounts, manages periods, completes handovers. |
| **Treasurer** | Financial writer | Creates/revises/voids transactions, opening balances, transfers, events, and categories in open periods. |
| **Auditor** | Financial writer | Has the same approved transaction-writing permissions as Treasurer. |
| **President** | Financial-data reader | Reviews data, generates/downloads Attachment C and CSV, signs report versions. |

### Governance & Internal Control Note

- Presidents cannot create, edit, void, transfer, or change opening-balance financial source data.
- Treasurer and Auditor have intentionally identical mutation authority; no approval queue is assumed.
- Super-Admin is not an ordinary organization ledger writer.
- Officers initiate turnover; Super-Admin completes it by closing the outgoing holder, activating the incoming holder, invalidating old sessions, requiring a password change, and writing audit history.
- RLS is the final access boundary; UI role checks are not authorization.

---

## 3. System Architecture & Routes

### Application Flow

```text
                         Landing Page / Auth
                                  |
              +-------------------+-------------------+
              |                                       |
       Organization workspace                    Super-Admin workspace
              |                                       |
  Dashboard - Ledger - Events - Reports        Provisioning - Handovers
              |
     Transfers - Opening Balances - Settings
```

### Route Specifications

1. **Landing Page (`/`)**
   - Product overview and Supabase Auth sign-in/recovery.
   - The server resolves the active organization/position from `auth.uid()`.

2. **Dashboard (`/dashboard`)**
   - Displays organization/period context, Bank, Cash-on-Hand, total liquidity, income/expense trends, categories, and events.

3. **Transactions (`/transactions`)**
   - Ledger of income and expenses with voucher, fund source, reference, item details, category, event, amount, and status.
   - Controlled mutations require a valid open period. Edits create revisions; voids preserve records and reasons.
   - No receipt-file or public receipt URL field is required.

4. **Events (`/events`), Transfers (`/transfers`), and Opening Balances (`/opening-balances`)**
   - Events are activities/projects and remain distinct from categories.
   - Transfers explicitly represent Bank ↔ Cash-on-Hand movement and never affect income/expense totals.
   - Opening Bank/Cash balances are entered manually each semester; prior closing may be shown only as a comparison.

5. **Reports (`/reports`)**
   - Generates authorized CSV exports and Attachment C report versions.
   - Attachment C uses posted expenses in one organization-period, groups event-linked expenses by event, and groups eventless expenses as **Miscellaneous**.
   - Its summary uses the event occurrence/start date; detailed rows use transaction dates.

6. **Settings (`/settings`) and Admin (`/admin`)**
   - Settings includes profile/position information and allowed turnover initiation.
   - Admin is Super-Admin-only for provisioning, period controls, and handover completion.

---

## 4. Database Schema Specification

The Supabase PostgreSQL design uses UUIDs, tenant-scoped relationships, constraints, RLS, controlled RPC mutations, and append-only audit evidence.

```text
faculties <- departments <- organizations <- positions <- position_holders -> profiles
                                       |          |
                                       |          -> auth.users position account
                                       +-- categories / events
                                       +-- period_opening_balances
                                       +-- transactions -> transaction_revisions
                                       +-- fund_transfers
                                       +-- attachment_c_reports -> versions -> signatures
system_admins -> provisioning and handover completion
audit_log -> append-only security/administrative history
```

### Table Structure (PostgreSQL / Supabase)

#### Institutional and identity tables

| Table | Responsibility |
|---|---|
| `faculties` / `departments` | Seeded VSU reference data; a department belongs to a faculty. |
| `organizations` | Department-bound tenant, status, timestamps. |
| `profiles` | Human identity. |
| `system_admins` | Platform administrator authorization. |
| `positions` | One position per organization/role; owns reusable `auth_user_id`. |
| `position_holders` | Historical person-to-position tenure; partial unique indexes ensure a single active holder/position and a single active position/profile. |
| `handover_requests` | Officer-initiated, Super-Admin-completed turnover. |

#### Academic and financial tables

| Table | Responsibility |
|---|---|
| `academic_periods` | Academic year + first/second semester, flexible dates, `open`/`closed`/`archived` state. |
| `period_opening_balances` | Unique manual Bank/Cash opening balance per organization-period; corrections require reason and audit history. |
| `categories` | Organization-owned analytical classification. |
| `events` | Organization activity/project with `start_date` and optional `end_date`. |
| `transactions` | Organization/period scoped income or expense, fund source, voucher, reference, item details, optional quantity/unit price, status, actor, timestamps. |
| `transaction_revisions` | Immutable revision number, actor, reason, before/after JSON snapshots. |
| `fund_transfers` | Internal Bank/Cash movement, not income or expense. |
| `voucher_sequences` | Organization/academic-year row-locked counter for `YYYY-YYYY-0001`. |
| `audit_log` | Append-only security/administrative events. |

#### Attachment C tables

| Table | Responsibility |
|---|---|
| `attachment_c_reports` | Report series for an organization-period. |
| `attachment_c_report_versions` | Immutable source snapshot, PDF location, hash, generator, version number. |
| `attachment_c_report_signatures` | One role-bound approval per version; signer must be a current correct organization holder. |

### Integrity Rules

- Transactions, events, categories, actors, transfers, reports, and signers must belong to the same organization.
- Amount must be positive. Quantity and unit price are both present or both absent; when present, amount equals quantity × unit price.
- A transaction is `posted` or `voided`. A void remains visible; an edit produces a revision with a required reason.
- Vouchers are allocated atomically in the database, never with client-side `MAX()+1`.
- Financial source data is writable only in an open period.

### Derived balances

```text
Bank closing = opening bank + posted bank income - posted bank expense
               + transfers into bank - transfers out of bank
Cash closing = opening cash + posted cash income - posted cash expense
               + transfers into cash - transfers out of cash
Total liquidity = Bank closing + Cash closing
```

---

## 5. Data Lifecycle & Retention Policy

The system does not have a destructive two-academic-year purge.

| State | Financial mutations | Visibility |
|---|---|---|
| Open | Treasurer/Auditor through controlled RPCs | Current organization. |
| Closed | Denied | Historical, read-only, exportable. |
| Archived | Denied | Historical, read-only, exportable. |

Performance is achieved with organization/period indexes and focused views. Deletion requires a future, explicit VSU retention policy and a governed process.

---

## 6. Technical Architecture & Code Structure

### Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16** | App Router, RSC by default, server actions/route handlers. |
| UI Runtime | **React 19** | Client components opt in with `"use client"`. |
| Language | **TypeScript 5** | Strict mode and UUID strings. |
| Styling | **Tailwind CSS 4** | Light-only Institutional Trust design tokens. |
| Backend / DB | **Supabase PostgreSQL** | Migrations, RLS, constraints, helper functions, controlled RPCs. |
| Auth | **Supabase Auth** | Position-account sessions through `@supabase/ssr`. |
| File Storage | **Supabase Storage** | Private generated Attachment C PDFs only. |
| PDF Engine | **Server-side renderer** | Render verified Attachment C snapshots. |

### Repository Layout

```text
app/
  (auth)/                         # Login, password recovery, reset password
  dashboard/                      # Analytics and liquidity
  transactions/                   # Ledger, revisions, void flows
  transfers/                      # Internal Bank/Cash fund movements
  opening-balances/               # Semester opening-balance setup
  events/                         # Activities/projects
  reports/                        # Attachment C and CSV exports
  settings/                       # Profile, position, turnover initiation
  admin/                          # Super-Admin workspace

components/
  atoms/                          # Buttons, inputs, labels, badges
  molecules/                      # Form fields, metric cards, filter controls
  organisms/                      # Ledger tables, forms, dashboards, report views
  templates/                      # Page-level layout compositions
  ui/                             # Shared base UI primitives

utils/
  supabase/
    client.ts                     # Browser Supabase client
    server.ts                     # Server Supabase client
    middleware.ts                 # Session refresh and route protection

lib/
  domain/
    actions/                      # Server Actions: reads/writes with inline AAA
    services/                     # Workflow orchestration and use-case delegation
    usecases/                     # Single-purpose database/Auth operations
  entities/                       # Domain types inferred from the schema
  validation/                     # Input validation schemas
  constants/                      # Roles, statuses, fixed values
  utils.ts                        # General shared utilities

supabase/
  migrations/                     # Versioned schema, RLS, helpers, and RPC changes
  tests/                          # Database, RLS, and financial-integrity tests
  seed.sql                        # Safe VSU catalog and test fixtures

docs/
  REQUIREMENTS.md
  ARCHITECTURE.md
  DOMAIN_MODEL_AND_SCHEMA_PLAN.md
  AUTH_AND_RBAC.md
  SUPABASE_RLS_SECURITY.md
  TESTING.md
  DEVELOPMENT_RULES.md
  IMPLEMENTATION_ROADMAP.md
  DESIGN_TOKEN.md

AGENTS.md                          # Instructions for development agents
```

### Supabase Setup & Request Flow

```text
Next.js page/form
  -> validated server action or route handler
  -> controlled Supabase RPC/query
  -> derives actor/org from auth.uid(), validates role/period/tenant/invariants
  -> PostgreSQL + RLS writes fact and revision/audit history atomically
  -> scoped response to UI
```

---

## 7. Getting Started & Local Development

### Environment Setup

```bash
git clone https://github.com/your-org/student-org-audit-system.git
cd student-org-audit-system
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="server-only-secret"
```

The service-role key must never be included in browser code, committed, or logged.

### Supabase CLI Operations

```bash
npx supabase init
npx supabase start
npx supabase db reset
npx supabase gen types typescript --local > lib/types/supabase.ts
npm run dev
```

Use an isolated/local Supabase project for database and RLS tests; never run destructive testing commands against production.

---

## 8. Standard Workflows & Adding New Features

1. Read the relevant requirements, domain model, RBAC, and RLS rules.
2. Add an ordered migration for schema, constraints, policy, helper, and/or controlled RPC work.
3. Add database/RLS tests, including cross-organization negative cases.
4. Regenerate TypeScript database types.
5. Implement server boundaries that derive actor/org from authentication rather than client input.
6. Build accessible components in the existing Atomic Design structure.
7. Add unit, integration, and E2E coverage proportional to the risk.
8. Run typecheck, lint, and relevant tests; visually inspect Attachment C after report-layout changes.
9. Do not expand scope or alter frozen decisions without an approved requirement change.

---

## 9. Code Samples & Implementation Guide

### 1. Supabase client configuration

Continue using the existing `@supabase/ssr` server/browser client split. Neither client receives a service-role key.

### 2. RLS and RPC migration pattern

```sql
-- Illustrative pattern: finalized SQL must be reviewed and tested.
create schema if not exists private;

create function private.is_same_org(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.positions p
    where p.auth_user_id = auth.uid()
      and p.organization_id = target_organization_id
  );
$$;

alter table public.transactions enable row level security;

create policy "read own organization transactions"
on public.transactions for select
to authenticated
using (private.is_same_org(organization_id));

-- Do not grant ordinary direct INSERT/UPDATE/DELETE policies.
-- Controlled RPCs create_transaction, revise_transaction,
-- and void_transaction enforce all financial/audit invariants.
```

### 3. Server action pattern for financial writes

```typescript
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTransactionAction(input: CreateTransactionInput) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_transaction", {
    transaction_date: input.transactionDate,
    academic_period_id: input.academicPeriodId,
    category_id: input.categoryId ?? null,
    event_id: input.eventId ?? null,
    transaction_type: input.transactionType,
    fund_source: input.fundSource,
    reference: input.reference,
    item_details: input.itemDetails,
    quantity: input.quantity ?? null,
    unit_price: input.unitPrice ?? null,
    amount: input.amount,
    description: input.description ?? null,
  });

  if (error) return { ok: false, error: "Unable to create transaction." };

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { ok: true, transaction: data };
}
```

The controlled RPC derives actor and organization from `auth.uid()`, allocates the voucher, validates the open period and tenant relationships, and writes revision/audit history. It does not accept a browser-supplied actor/organization and has no receipt-upload step.

