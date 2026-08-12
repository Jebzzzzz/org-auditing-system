# OrgAudit - Testing Strategy

## Quality gates

No feature is complete until relevant unit, database, integration, and end-to-end tests pass, plus linting, type checking, and a review of migrations/RLS changes. Fixtures must use at least two organizations and distinct position accounts.

## Test layers

| Layer | Purpose | Representative coverage |
|---|---|---|
| Unit | Deterministic business rules | balance formula, numeric validation, Attachment C grouping and totals, voucher formatting. |
| Database/migration | Constraints, triggers, RLS, RPCs | active-holder uniqueness, same-tenant FK alignment, revision immutability, voucher concurrency. |
| Integration | Server/RPC plus Supabase behavior | permitted and denied mutations, report snapshot generation, signed private download authorization. |
| End-to-end | Real officer workflows | sign-in, ledger correction, turnover, report version/sign/export. |
| Regression | Fixed cases for every confirmed defect | especially finance/security/reporting defects. |

## Mandatory scenarios

### Tenant isolation and RBAC

- Treasurer/Auditor/President from Organization A cannot select, insert, update, void, export, sign, or download Organization B data.
- A forged `organization_id`, `event_id`, `category_id`, `created_by`, or signer from Organization B is rejected.
- President can read and export but cannot change balances, transactions, transfers, categories, or events.
- Super-Admin can provision and complete handover but cannot silently perform ordinary organization financial writes.
- Direct client DML to financial facts, revisions, report versions, and audit log is denied.

### Financial integrity

- Manual opening balance is unique per organization-period and rejects negative values.
- Quantity/unit-price pairs are both present or both null; computed amount agreement is enforced.
- Voucher allocation is unique under concurrent requests and resets by organization academic year.
- A transaction edit requires a reason and preserves correct before/after snapshots with revision numbers.
- Void requires a reason; voided records remain historically visible and leave current balances/Attachment C.
- Bank-to-cash and cash-to-bank transfers preserve total liquidity while changing correct component balances.
- Closed/archived periods reject source-data mutations but allow authorized history/export reads.

### Turnover and report integrity

- A person cannot have two active officer positions; each position has one active holder.
- Officer initiated handover remains pending until Super-Admin completion; former holder loses active authorization after completion.
- Attachment C selects only posted expenses for the chosen organization-period.
- Event-linked expenses group by event; eventless expenses group under Miscellaneous without creating an event.
- Event summary date is `events.start_date`; detail rows use transaction date.
- Snapshot Version 1, its PDF hash, and its signatures are unchanged after a ledger correction; Version 2 has changed numbers and requires new signatures.
- Each role signs only its own role once per report version, in any order.

## Report rendering verification

Use fixture data that exercises page breaks, long references, blank item details, numeric/non-numeric item details, multi-day events, Miscellaneous, zero-safe totals, and Philippine currency formatting. Compare rendered output to the approved `ATTACHMENT-C.pdf` content structure: summary, detailed rows, subtotals, grand total, legibility, and pagination. Treat header/footer as template configuration, so test them separately from accounting facts.

## Test data and environments

- Use a local/isolated Supabase project and disposable database state; never point automated destructive tests at production.
- Seed VSU catalogs plus Organization A and B, all three positions, a Super-Admin, open/closed/archived periods, and known financial fixtures.
- Keep test credentials and generated report objects private, ephemeral, and outside source control.
- Run migration tests from an empty database and an approved representative upgrade fixture before release.
