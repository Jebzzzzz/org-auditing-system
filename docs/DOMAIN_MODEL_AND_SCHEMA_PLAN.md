# OrgAudit - Domain Model and Schema Plan

**Status:** planning design; replace the preview schema through ordered migrations, never by editing production manually.

## Reconciled design

The supplied preview has ten conceptual tables, not nine. This plan retains its useful core (`faculties`, `departments`, `organizations`, `profiles`, `positions`, `position_holders`, `categories`, `events`, `transactions`, and reports) and adds entities required by user-approved accounting, handover, and versioning rules. It also corrects the prior UUID contradiction: all IDs are UUID strings end-to-end.

`ATTACHMENT-C.pdf` requires textual `reference` and `item_details`; neither is interchangeable with a voucher number or a numeric quantity.

## Relationship map

```text
faculty <- department <- organization <- position <- position_holder -> profile
                                      |                 |
                                      |                 -> auth user (position account)
                                      +-- organization_period -> opening_balance
                                      +-- category / event
                                      +-- transaction -> transaction_revision
                                      +-- fund_transfer
                                      +-- attachment_c_report -> report_version -> report_signature
system_admin -> platform provisioning / turnover approval
```

## Tables and minimum responsibilities

| Area | Table | Key responsibility |
|---|---|---|
| Reference | `faculties`, `departments` | Seeded VSU catalog; department references faculty. |
| Tenant | `organizations` | Department-bound organization and lifecycle. |
| Identity | `profiles` | Human identity separate from position credentials. |
| Platform | `system_admins` | Auth users authorized for platform administration. |
| Roles | `positions` | One Treasurer, Auditor, and President position per organization; holds the position account's `auth_user_id`. |
| Tenure | `position_holders` | Time-bounded person-to-position history. |
| Handover | `handover_requests` | Officer-initiated, Super-Admin-completed transition. |
| Calendar | `academic_periods` | Institution-wide AY + first/second semester and state. |
| Balances | `period_opening_balances` | One manual Bank/Cash opening pair per organization-period. |
| Ledger | `categories`, `events`, `transactions`, `transaction_revisions` | Financial source data and visible correction history. |
| Liquidity | `fund_transfers` | Non-income/non-expense internal movement. |
| Numbering | `voucher_sequences` | Atomic organization + academic-year allocation. |
| Reporting | `attachment_c_reports`, `attachment_c_report_versions`, `attachment_c_report_signatures` | Report identity, immutable snapshots, and version-bound approvals. |
| Audit | `audit_log` | Append-only security/administrative history. |

## Core column plan and constraints

### Access and institutional tables

- `departments(faculty_id)` has a unique official code/name within its faculty.
- `organizations(department_id, status, created_at, updated_at)` derives faculty through joins; do not duplicate `faculty_id` unless a deliberate denormalized constraint is added.
- `positions(organization_id, role, auth_user_id)` has `unique(organization_id, role)` and a unique non-null `auth_user_id`. Role is only `treasurer`, `auditor`, or `president`; Super-Admin remains separate.
- `position_holders(position_id, profile_id, start_date, end_date, ...)` has one open holder per position and one open position per profile using partial unique indexes. Its historical rows are never rewritten to pretend a different person held the role.
- `handover_requests` records outgoing holder, proposed incoming profile, initiating position/account, status, reviewer, completion time, and rejection/cancellation reason. Completing it is one database transaction: close old holder, open new holder, write audit log, and require credential reset/session revocation through the auth-management service.

### Periods and financial data

- `academic_periods(academic_year, semester, start_date nullable, end_date nullable, status)` uses `unique(academic_year, semester)`; semester is only `first_semester` or `second_semester`.
- `period_opening_balances(organization_id, academic_period_id, bank_balance numeric(14,2), cash_on_hand_balance numeric(14,2), ...)` has `unique(organization_id, academic_period_id)`, non-negative amounts, setter metadata, and audit entries for changes.
- `categories` are organization-owned (optionally seeded by copying defaults) and unique by normalized name within organization.
- `events(organization_id, academic_period_id, title, start_date, end_date nullable, ...)` has `end_date >= start_date` when end date exists. Events remain domain activities, not substitute categories.
- `transactions` includes `organization_id`, `academic_period_id`, nullable `event_id`, nullable `category_id`, `created_by_position_holder_id`, `transaction_date`, `voucher_sequence`, `voucher_number`, `type`, `fund_source`, `reference`, `item_details`, nullable `quantity`, nullable `unit_price`, `amount`, optional `description`, status/void fields, version, and timestamps.
- Transaction checks: positive `amount`; quantity and unit price supplied together or both null; positive quantity; non-negative unit price; and amount equals `quantity * unit_price` when numeric fields exist. Status is `posted` or `voided`.
- `transaction_revisions` contains transaction, monotonic revision number, actor holder, required reason, `before_data jsonb`, `after_data jsonb`, and timestamp. The table is append-only.
- `fund_transfers` includes organization, period, source/destination fund, amount, transfer date, reference, description, actor, status/void metadata, and timestamps. Check source <> destination and amount > 0.
- `voucher_sequences(organization_id, academic_year, last_number)` has a composite primary key. A row-locking database function allocates the next number; do not use `MAX()+1` in application code.

### Reports and audit trail

- `attachment_c_reports(organization_id, academic_period_id, current_version_id nullable, created_by, created_at)` represents the report series; unique per organization-period unless the product later explicitly supports separate report series.
- `attachment_c_report_versions(report_id, version_number, snapshot_data jsonb, source_hash, pdf_path, generated_by, generated_at, supersedes_version_id nullable)` is append-only and unique by report/version.
- `attachment_c_report_signatures(report_version_id, role, position_holder_id, signed_at)` is unique by version/role and validates that the holder occupied that role in the same organization when signed.
- `audit_log` captures immutable actor, organization where relevant, entity type/id, action, before/after JSON, reason, request correlation ID, and timestamp. It complements, rather than replaces, the user-facing transaction revisions.

## Tenant-integrity enforcement

Foreign keys alone cannot prevent a transaction in Organization A from pointing to a valid event in Organization B. Enforce critical alignment in the database by composite foreign keys where practical (for example unique `(id, organization_id)` targets) and validation triggers/RPCs elsewhere. At minimum validate matching organization for transaction-event, transaction-category, transaction-actor, report-version-signature, opening balance, and transfer actor relationships.

Use `numeric(14,2)` for Philippine currency values, `date` for local accounting/event dates, and `timestamptz` for audit timestamps. Add conventional indexes for `(organization_id, academic_period_id)`, event/category lookups, voucher scope, report version, and audit-log entity lookup.

## Derived balances and report query

```text
bank closing = opening bank + posted bank income - posted bank expense
               + posted transfers into bank - posted transfers out of bank
cash closing = opening cash + posted cash income - posted cash expense
               + posted transfers into cash - posted transfers out of cash
total liquidity = bank closing + cash closing
```

Attachment C selects only `posted` expenses for a selected organization-period, groups `event_id is null` as Miscellaneous, otherwise groups by event, uses `events.start_date` in the summary, and captures the result as snapshot JSON before rendering.

## Migration order

1. Establish enum/type, timestamp, profile/position, and system-admin foundations.
2. Add academic periods, opening balances, voucher allocator, transfer/revision/audit tables.
3. Expand transactions with reporting fields and status; backfill only after an approved data-migration plan.
4. Add reports/versions/signatures and storage metadata.
5. Add constraints, indexes, RLS, mutation RPCs, seed catalogs, and generated TypeScript types.

No production data migration or backfill is authorized by this planning document.
