# OrgAudit Design Tokens

**Status:** approved token reference for OrgAudit, a VSU financial-accountability application.

This is a light-only, high-density audit interface. It must make Bank, Cash on Hand, period status, approvals, and financial amounts understandable without using color as the only signal.

## Design direction

Use an **Institutional Trust** direction:

- Deep navy for VSU-facing institutional identity and navigation.
- Slate neutrals for quiet, readable ledger tables.
- Indigo for primary actions and keyboard focus.
- Semantic colors only for operational status.
- Separate named tokens for Bank and Cash on Hand.
- No trading, ticker, price-movement, or profit/loss terminology.

## Core palette

| Token | Value | Use |
|---|---:|---|
| `--background` | `#F8FAFC` | Application background |
| `--foreground` | `#0F172A` | Primary text |
| `--card` | `#FFFFFF` | Cards, tables, popovers |
| `--primary` | `#0A2540` | App shell, navigation, institutional headings |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--secondary` | `#4F46E5` | Main action, selected navigation, focus |
| `--secondary-foreground` | `#FFFFFF` | Text on secondary |
| `--accent` | `#E2E8F0` | Neutral hover/selected surface |
| `--accent-foreground` | `#1E293B` | Text on accent |
| `--muted` | `#F1F5F9` | Table header, inactive filter, quiet surface |
| `--muted-foreground` | `#475569` | Labels, metadata, secondary text |
| `--border` | `#64748B` | Functional component boundary |
| `--border-subtle` | `#E2E8F0` | Decorative divider or grid line |
| `--input` | `#64748B` | Input boundary |
| `--ring` | `#4F46E5` | Keyboard focus ring |

Use `--border-subtle` only if another cue already defines the boundary. Inputs, selected rows, expandable controls, and table-header rules use `--border` or another accessible treatment.

## Semantic states

| State | Strong | Soft background | Soft text | Use |
|---|---:|---:|---:|---|
| Success | `#047857` | `#ECFDF5` | `#065F46` | Posted, saved, signed, completed |
| Warning | `#B45309` | `#FEF3C7` | `#92400E` | Pending handover, incomplete signatures, discrepancy |
| Destructive | `#DC2626` | `#FEF2F2` | `#991B1B` | Void, rejection, validation error |
| Info | `#0369A1` | `#E0F2FE` | `#075985` | Period notice, report guidance, neutral information |

Strong state colors use white text. Prefer soft status badges and banners on dense financial screens. Every status must include text; color must never be the only indicator.

Do not use green to mean income or red to mean expense by itself. A transaction type must have a clear text label, sign, and table column.

## Fund source tokens

Bank and Cash on Hand show location of money, not a positive/negative value.

| Source | Strong | Soft background | Soft text | Use |
|---|---:|---:|---:|---|
| Bank | `#075985` | `#E0F2FE` | `#075985` | Bank balance card, filter, transfer endpoint |
| Cash on Hand | `#6D28D9` | `#F3E8FF` | `#5B21B6` | Cash card, filter, transfer endpoint |

Always display the words **Bank** or **Cash on Hand** beside the color. A fund transfer displays its source, destination, direction, and amount. It is never presented as income or expense.

## Typography

Use only two font families.

| Token | Font stack | Use |
|---|---|---|
| `--font-sans` | `Inter, system-ui, sans-serif` | Navigation, headings, labels, forms, body |
| `--font-mono` | `IBM Plex Mono, ui-monospace, monospace` | Amounts, voucher numbers, transaction IDs, ledger columns |

Do not add a serif display font. OrgAudit is an operational system; limiting fonts improves performance and hierarchy.

### Financial-data rules

- Use tabular figures on every currency amount, voucher number, and numeric table column.
- Right-align amounts, quantities, and totals.
- Format currency as `₱12,345.67`.
- Show a minus sign and a written type/status; do not rely only on red text.
- Use slashed zero for vouchers and IDs where supported.
- Use sentence case for labels; use uppercase only for compact, familiar status badges.

~~~css
.font-tabular {
  font-variant-numeric: tabular-nums;
}

.font-zero {
  font-variant-numeric: slashed-zero;
}
~~~

## Layout and elevation

Finance views need compact, stable geometry.

| Token | Value | Use |
|---|---:|---|
| `--radius` | `0.5rem` | Default control/card radius |
| `--radius-sm` | `0.25rem` | Tags and tight controls |
| `--radius-md` | `0.375rem` | Inputs and compact cards |
| `--radius-lg` | `0.5rem` | Standard cards and dialog sections |
| `--radius-xl` | `0.75rem` | Large dialog only |
| `--shadow-soft` | subtle navy shadow | Standard card |
| `--shadow-float` | elevated navy shadow | Menu and popover |
| `--shadow-modal` | deep navy shadow | Important confirmation dialog |

Ledger rows should not be pill-shaped. Use clear header rules, thin cell dividers, selected-row highlights, and adequate touch targets.

~~~css
.fin-card {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--card);
  box-shadow: var(--shadow-soft);
}

.fin-table-header {
  background: var(--muted);
  border-bottom: 1px solid var(--border);
  font-variant-numeric: tabular-nums;
}

.fin-grid-cell {
  border-right: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}
~~~

## Motion

Motion confirms completed activity; it must never simulate market movement.

| Animation | Duration | Use |
|---|---:|---|
| Fade in | 160ms | Dialog, popover, banner |
| Fade in up | 200ms | Page widget or drawer |
| Value flash | 350ms | Confirmed amount update |
| Row highlight | 700ms | Created or revised transaction row |

Do not use ticker, live-price, continuous pulse, or distracting numerical animations. Respect `prefers-reduced-motion`.

## Tailwind CSS v4 setup

Put the following in `app/globals.css`.

~~~css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-border-subtle: var(--border-subtle);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-success-muted: var(--success-muted);
  --color-success-muted-foreground: var(--success-muted-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-warning-muted: var(--warning-muted);
  --color-warning-muted-foreground: var(--warning-muted-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-destructive-muted: var(--destructive-muted);
  --color-destructive-muted-foreground: var(--destructive-muted-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-info-muted: var(--info-muted);
  --color-info-muted-foreground: var(--info-muted-foreground);
  --color-bank: var(--bank);
  --color-bank-muted: var(--bank-muted);
  --color-bank-muted-foreground: var(--bank-muted-foreground);
  --color-cash: var(--cash);
  --color-cash-muted: var(--cash-muted);
  --color-cash-muted-foreground: var(--cash-muted-foreground);
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-ibm-plex-mono), ui-monospace, monospace;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --background: #F8FAFC;
  --foreground: #0F172A;
  --card: #FFFFFF;
  --primary: #0A2540;
  --primary-foreground: #FFFFFF;
  --secondary: #4F46E5;
  --secondary-foreground: #FFFFFF;
  --accent: #E2E8F0;
  --accent-foreground: #1E293B;
  --muted: #F1F5F9;
  --muted-foreground: #475569;
  --border: #64748B;
  --border-subtle: #E2E8F0;
  --input: #64748B;
  --ring: #4F46E5;

  --success: #047857;
  --success-foreground: #FFFFFF;
  --success-muted: #ECFDF5;
  --success-muted-foreground: #065F46;
  --warning: #B45309;
  --warning-foreground: #FFFFFF;
  --warning-muted: #FEF3C7;
  --warning-muted-foreground: #92400E;
  --destructive: #DC2626;
  --destructive-foreground: #FFFFFF;
  --destructive-muted: #FEF2F2;
  --destructive-muted-foreground: #991B1B;
  --info: #0369A1;
  --info-foreground: #FFFFFF;
  --info-muted: #E0F2FE;
  --info-muted-foreground: #075985;

  --bank: #075985;
  --bank-muted: #E0F2FE;
  --bank-muted-foreground: #075985;
  --cash: #6D28D9;
  --cash-muted: #F3E8FF;
  --cash-muted-foreground: #5B21B6;

  --radius: 0.5rem;
  --shadow-soft: 0 1px 3px 0 rgb(10 37 64 / 8%), 0 1px 2px -1px rgb(10 37 64 / 4%);
  --shadow-float: 0 10px 25px -5px rgb(10 37 64 / 12%), 0 8px 10px -6px rgb(10 37 64 / 8%);
  --shadow-modal: 0 25px 50px -12px rgb(10 37 64 / 25%);
}
~~~

## Component rules

- `bg-primary` is for app-shell identity, not every button.
- `bg-secondary` is for the current primary action, such as **Add transaction** or **Generate Attachment C**.
- Use a destructive confirmation dialog before voiding a transaction.
- Prefer soft semantic badge/background combinations for ledger status.
- Use `font-mono font-tabular text-right` for financial table amounts.
- Use a visible `ring-ring` focus treatment on every keyboard-operable control.

