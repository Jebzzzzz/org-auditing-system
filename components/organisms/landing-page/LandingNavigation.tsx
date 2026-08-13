import { focusRing } from "@/components/atoms/landing-page/FocusRing";
import { Wordmark } from "@/components/atoms/landing-page/Wordmark";
import { NavLinks } from "@/components/molecules/landing-page/NavLinks";
import { landingNavigation } from "@/lib/constants/landing-page";

export function LandingNavigation() {
  return (
    <nav
      aria-label="Primary navigation"
      className="relative z-20 border-b border-slate-200 bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="OrgAudit home" className={`rounded-sm ${focusRing}`}>
          <Wordmark />
        </a>
        <NavLinks items={landingNavigation} />
        <a
          href="#contact"
          className={`inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_rgb(10_37_64_/_16%)] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${focusRing}`}
        >
          Request access
        </a>
      </div>
    </nav>
  );
}
