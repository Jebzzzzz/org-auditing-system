export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className="relative flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_8px_18px_rgb(10_37_64_/_16%)]"
      >
        <span className="absolute left-2 top-2 h-3 w-3 rounded-sm border border-indigo-200" />
        <span className="absolute bottom-2 right-2 h-3 w-3 rounded-sm bg-indigo-200" />
      </span>
      <span className="text-lg font-semibold tracking-[-0.04em]">OrgAudit</span>
    </span>
  );
}
