# OrgAudit - RBAC Matrix

**Scope:** application intent. The enforceable version is `SUPABASE_RLS_SECURITY.md` and its database policies/RPCs.

| Capability | Super-Admin | Treasurer | Auditor | President |
|---|:---:|:---:|:---:|:---:|
| Read VSU faculty/department catalog | Yes | Yes | Yes | Yes |
| Create/change faculty or department catalog | Controlled provisioning only | No | No | No |
| Create/activate/deactivate organization | Yes | No | No | No |
| Create initial position accounts | Yes | No | No | No |
| View own organization structure and officers | Administrative | Yes | Yes | Yes |
| View another organization’s financial data | No by normal app path | No | No | No |
| Initiate handover for own organization | Review/manage | Yes | Yes | Yes |
| Approve/complete/reject handover | Yes | No | No | No |
| View active and historical officer holders in own organization | Yes | Yes | Yes | Yes |
| Enter/change opening balances in open period | No normally | Yes | Yes | No |
| Create/revise/void transaction in open period | No normally | Yes | Yes | No |
| View transaction revision history | Yes | Yes | Yes | Yes |
| Create/revise/void internal transfer in open period | No normally | Yes | Yes | No |
| Manage organization categories/events in open period | No normally | Yes | Yes | No |
| View balances, ledger, dashboard, historical records | Support-scoped | Yes | Yes | Yes |
| Generate/download Attachment C and CSV for own organization | Support-scoped | Yes | Yes | Yes |
| Sign Attachment C version | No | Treasurer only | Auditor only | President only |
| View report versions/signatures in own organization | Yes | Yes | Yes | Yes |
| Change report presentation template | Controlled deployment/configuration only | No | No | No |
| View audit logs | Platform/support-scoped | Own organization subset | Own organization subset | Own organization subset |

## Role interpretation

Treasurer and Auditor intentionally have identical financial source-data writing rights; this is a user-approved rule, not an omission of approval workflow. President is read-only for source financial data but is not passive: they can generate, export, download, review, and sign report versions.

## Authorization conditions

An otherwise permitted action is denied unless all conditions hold:

1. The authenticated account maps to an active position or active system admin.
2. The record belongs to the account’s organization, except bounded Super-Admin provisioning/support operations.
3. The academic period is open for financial source-data mutation.
4. The required reason and actor metadata are present for correction/void actions.
5. Report signer role matches the active signer position and report organization.

Super-Admin access is deliberately narrow: it provisions and completes turnover but does not ordinarily act as an organization’s ledger writer. Any emergency support access requires an auditable, separately authorized operational procedure.
