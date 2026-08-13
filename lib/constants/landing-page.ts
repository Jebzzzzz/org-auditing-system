export const landingNavigation = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Accountability", href: "#accountability" },
  { label: "Reports", href: "#reports" },
] as const;

export const landingContinuityFacts = [
  "Semester opening balances",
  "Bank and Cash on Hand",
  "Revision and void history",
  "Versioned report snapshots",
] as const;

export const landingActivityRows = [
  {
    label: "CS Week materials",
    detail: "Expense · Voucher 2026–2027-0007",
    amount: "−₱4,800.00",
    tone: "expense",
  },
  {
    label: "Bank to Cash on Hand",
    detail: "Fund transfer · Recorded",
    amount: "₱10,000.00",
    tone: "transfer",
  },
  {
    label: "Opening balance correction",
    detail: "Revision · Reason logged",
    amount: "View trail",
    tone: "revision",
  },
] as const;

export const landingFeatures = [
  {
    title: "Semester balances stay visible.",
    description:
      "Open every First or Second Semester with separate Bank and Cash on Hand amounts, plus the prior closing context officers need to review the handoff.",
    label: "Opening balances",
    tone: "paper",
    span: "md:col-span-7",
  },
  {
    title: "Corrections carry their history.",
    description:
      "Revisions require a reason. Voided transactions remain visible and explain why current totals changed.",
    label: "Revision history",
    tone: "navy",
    span: "md:col-span-5",
  },
  {
    title: "Transfers stay in their own lane.",
    description:
      "Bank-to-Cash-on-Hand and Cash-on-Hand-to-Bank movements change location, not income or expense totals.",
    label: "Fund movement",
    tone: "indigo",
    span: "md:col-span-5",
  },
  {
    title: "A report is a versioned record.",
    description:
      "Attachment C is generated from an immutable source snapshot. Later financial changes produce a new version instead of rewriting the old one.",
    label: "Attachment C",
    tone: "paper",
    span: "md:col-span-7",
  },
  {
    title: "Access follows the position.",
    description:
      "Treasurer, Auditor, and President work from clear position boundaries, with organization isolation enforced at the database boundary.",
    label: "Position-based access",
    tone: "mist",
    span: "md:col-span-12",
  },
] as const;

export type LandingFeature = (typeof landingFeatures)[number];

export const landingAccountabilitySteps = [
  {
    title: "Officer action",
    description: "A Treasurer or Auditor records a source fact for the active period.",
    mark: "01",
  },
  {
    title: "Validated record",
    description: "The system checks scope, amount, period state, and related ownership.",
    mark: "02",
  },
  {
    title: "Audit history",
    description: "Reasons, revisions, voids, and actors remain part of the record.",
    mark: "03",
  },
  {
    title: "Reviewable report",
    description: "A versioned Attachment C snapshot gives officers a stable result to review and sign.",
    mark: "04",
  },
] as const;

export const landingReportRoles = [
  { role: "Treasurer", status: "Review path" },
  { role: "Auditor", status: "Review path" },
  { role: "President", status: "Review path" },
] as const;

  
