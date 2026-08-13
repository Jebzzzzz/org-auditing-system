import { focusRing } from "@/components/atoms/landing-page/FocusRing";
import { SectionEyebrow } from "@/components/atoms/landing-page/SectionEyebrow";
import { ArrowLink } from "@/components/molecules/landing-page/ArrowLink";
import { LedgerPreview } from "@/components/organisms/landing-page/LedgerPreview";

export function LandingHero() {
  return (
    <header className="relative isolate border-b border-slate-200">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgb(79_70_229_/_12%),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)]" />
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24 lg:grid-cols-[minmax(0,0.87fr)_minmax(31rem,1.13fr)] lg:items-center lg:gap-12 lg:px-12 lg:pb-40 lg:pt-24">
        <div className="landing-rise max-w-[52rem]">
          <SectionEyebrow className="mb-7">Financial accountability for VSU organizations</SectionEyebrow>
          <h1 className="max-w-[50rem] text-[clamp(3.2rem,6.1vw,6.9rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-primary">
            Keep a trustworthy record through every officer transition.
          </h1>
          <p className="mt-8 max-w-[590px] text-lg leading-8 text-muted-foreground sm:text-xl">
            OrgAudit keeps one organization’s semester balances, transactions, fund movements, revisions, and report versions structured for the people who inherit the work next.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href="#how-it-works"
              className={`inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_12px_24px_rgb(10_37_64_/_18%)] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${focusRing}`}
            >
              See how it works
            </a>
            <ArrowLink href="#accountability">Explore accountability</ArrowLink>
          </div>
        </div>
        <LedgerPreview />
      </div>
    </header>
  );
}
