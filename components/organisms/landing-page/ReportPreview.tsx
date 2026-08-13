import { landingReportRoles } from "@/lib/constants/landing-page";

export function ReportPreview() {
  return (
    <article
      aria-label="Attachment C version preview"
      className="relative overflow-hidden rounded-lg border border-white/15 bg-primary/80 p-5 shadow-[0_26px_70px_rgb(0_0_0_/_20%)] sm:p-7"
    >
      <div className="absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full bg-indigo-500/25 blur-3xl" />
      <header className="relative flex items-start justify-between gap-5 border-b border-white/10 pb-5">
        <div>
          <p className="text-sm font-semibold text-white">Attachment C</p>
          <p className="mt-1 text-xs text-slate-300">Organization Expenses · AY 2026–2027</p>
        </div>
        <span className="rounded-sm border border-emerald-300/40 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
          Snapshot locked
        </span>
      </header>
      <dl className="relative grid gap-5 border-b border-white/10 py-6 sm:grid-cols-[0.7fr_1.3fr]">
        <div>
          <dt className="text-xs text-slate-300">Version</dt>
          <dd className="mt-2 font-mono text-4xl font-semibold tabular-nums tracking-[-0.08em] text-white">02</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-300">Source record</dt>
          <dd className="mt-2 text-sm font-medium text-white">Captured from the reviewed ledger state</dd>
          <dd className="mt-1 text-xs text-slate-300">Later changes create a new version.</dd>
        </div>
      </dl>
      <ul className="relative divide-y divide-white/10">
        {landingReportRoles.map((item) => (
          <li key={item.role} className="flex items-center justify-between gap-5 py-4 text-sm">
            <span className="text-white">{item.role}</span>
            <span className="text-slate-300">{item.status}</span>
          </li>
        ))}
      </ul>
      <div className="relative mt-2 flex items-center justify-between border-t border-white/10 pt-5 text-xs">
        <span className="text-slate-300">Report status</span>
        <span className="font-semibold text-emerald-200">Ready for review</span>
      </div>
    </article>
  );
}
