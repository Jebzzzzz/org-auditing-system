import { landingActivityRows } from "@/lib/constants/landing-page";

export function LedgerPreview() {
  return (
    <article
      aria-label="Illustrated OrgAudit ledger preview"
      className="landing-rise relative mx-auto w-full max-w-[640px] lg:ml-auto"
      style={{ animationDelay: "120ms" }}
    >
      <div className="absolute -inset-8 -z-10 rounded-[1.25rem] bg-indigo-100/70 blur-3xl" />
      <div className="overflow-hidden rounded-lg border border-primary/20 bg-white shadow-[0_28px_80px_rgb(10_37_64_/_18%)]">
        <header className="flex items-start justify-between gap-5 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-7">
          <div>
            <p className="text-sm font-semibold text-primary">Organization ledger</p>
            <p className="mt-1 text-xs text-muted-foreground">AY 2026–2027 · First Semester</p>
          </div>
          <span className="rounded-sm border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            Open period
          </span>
        </header>

        <dl className="grid grid-cols-2 border-b border-slate-200">
          <div className="border-r border-slate-200 px-5 py-6 sm:px-7">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky-700" /> Bank
            </dt>
            <dd className="mt-3 font-mono text-2xl font-semibold tabular-nums tracking-[-0.05em] text-primary sm:text-3xl">
              ₱128,450.00
            </dd>
            <dd className="mt-2 text-xs text-muted-foreground">Posted balance</dd>
          </div>
          <div className="px-5 py-6 sm:px-7">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-800">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-violet-700" /> Cash on Hand
            </dt>
            <dd className="mt-3 font-mono text-2xl font-semibold tabular-nums tracking-[-0.05em] text-primary sm:text-3xl">
              ₱24,780.00
            </dd>
            <dd className="mt-2 text-xs text-muted-foreground">Posted balance</dd>
          </div>
        </dl>

        <div className="p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Latest activity
            </p>
            <p className="text-xs font-medium text-emerald-700">Audit trail active</p>
          </div>
          <div className="overflow-hidden rounded-md border border-slate-300">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Sample ledger activity and status</caption>
              <thead className="bg-slate-100 text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Activity</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {landingActivityRows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-200 align-top">
                    <th scope="row" className="px-4 py-3.5 font-medium text-primary">
                      <span className="block text-sm">{row.label}</span>
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">{row.detail}</span>
                    </th>
                    <td
                      className={`whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold ${
                        row.tone === "expense"
                          ? "text-rose-700"
                          : row.tone === "transfer"
                            ? "text-indigo-700"
                            : "text-emerald-700"
                      }`}
                    >
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-muted-foreground">
            <span>Report status</span>
            <span className="font-semibold text-primary">Version 02 · Ready for review</span>
          </div>
        </div>
      </div>
    </article>
  );
}
