import { focusRing } from "@/components/atoms/landing-page/FocusRing";
import { SectionEyebrow } from "@/components/atoms/landing-page/SectionEyebrow";

export function CTASection() {
  return (
    <section id="contact" className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-40">
        <div>
          <SectionEyebrow>For VSU organizations</SectionEyebrow>
          <h2 className="mt-5 max-w-[800px] text-5xl font-semibold leading-[0.94] tracking-[-0.07em] text-primary sm:text-7xl">
            Bring the record into one accountable system.
          </h2>
          <p className="mt-7 max-w-[560px] text-lg leading-8 text-muted-foreground">
            Start with the financial history your officers already carry. Keep it structured for the people who review it next.
          </p>
        </div>
        <div className="flex flex-col items-start gap-5 lg:items-end">
          <a
            href="#top"
            className={`inline-flex min-h-12 items-center justify-center rounded-md bg-secondary px-6 text-sm font-semibold text-secondary-foreground shadow-[0_12px_24px_rgb(79_70_229_/_22%)] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${focusRing}`}
          >
            Request access
          </a>
          <span className="text-xs text-muted-foreground">A VSU-only system for organization records</span>
        </div>
      </div>
    </section>
  );
}
