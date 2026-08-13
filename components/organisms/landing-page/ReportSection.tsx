import { ArrowIcon } from "@/components/atoms/landing-page/ArrowIcon";
import { focusRing } from "@/components/atoms/landing-page/FocusRing";
import { SectionEyebrow } from "@/components/atoms/landing-page/SectionEyebrow";
import { ReportPreview } from "@/components/organisms/landing-page/ReportPreview";

export function ReportSection() {
  return (
    <section id="reports" className="overflow-hidden bg-primary text-white">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24 lg:px-12 lg:py-40">
        <div>
          <SectionEyebrow className="text-indigo-200">Report lifecycle</SectionEyebrow>
          <h2 className="mt-5 max-w-[600px] text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
            A report you can review later is a report worth preserving.
          </h2>
          <p className="mt-7 max-w-[570px] text-lg leading-8 text-slate-300">
            Attachment C is generated from an immutable source snapshot. When the ledger changes, the next report is a new version with its own review path.
          </p>
          <div className="mt-9">
            <a
              href="#contact"
              className={`group inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-indigo-200 ${focusRing}`}
            >
              Bring the record forward
              <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
        <ReportPreview />
      </div>
    </section>
  );
}
