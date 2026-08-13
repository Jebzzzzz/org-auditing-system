import { focusRing } from "@/components/atoms/landing-page/FocusRing";
import { Wordmark } from "@/components/atoms/landing-page/Wordmark";
import { NavLinks } from "@/components/molecules/landing-page/NavLinks";
import { landingNavigation } from "@/lib/constants/landing-page";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <a href="#top" aria-label="OrgAudit home" className={`rounded-sm text-primary ${focusRing}`}>
          <Wordmark />
        </a>
        <NavLinks items={landingNavigation} hideOnMobile={false} className="flex-wrap gap-x-6 gap-y-3" />
        <p className="text-xs text-muted-foreground">Financial accountability for VSU organizations</p>
      </div>
    </footer>
  );
}
