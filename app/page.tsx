import { AccountabilitySection } from "@/components/organisms/landing-page/AccountabilitySection";
import { CTASection } from "@/components/organisms/landing-page/CTASection";
import { ContinuitySection } from "@/components/organisms/landing-page/ContinuitySection";
import { FeatureGrid } from "@/components/organisms/landing-page/FeatureGrid";
import { Footer } from "@/components/organisms/landing-page/Footer";
import { LandingHero } from "@/components/organisms/landing-page/LandingHero";
import { LandingNavigation } from "@/components/organisms/landing-page/LandingNavigation";
import { ReportSection } from "@/components/organisms/landing-page/ReportSection";

export default function HomePage() {
  return (
    <main id="top" className="w-full max-w-full overflow-x-hidden bg-background text-foreground">
      <LandingNavigation />
      <LandingHero />
      <ContinuitySection />
      <FeatureGrid />
      <AccountabilitySection />
      <ReportSection />
      <CTASection />
      <Footer />
    </main>
  );
}
