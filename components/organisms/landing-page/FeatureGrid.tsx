import { FeatureCard } from "@/components/molecules/landing-page/FeatureCard";
import { SectionHeading } from "@/components/molecules/landing-page/SectionHeading";
import { landingFeatures } from "@/lib/constants/landing-page";

export function FeatureGrid() {
  return (
    <section id="features" className="border-b border-slate-200 bg-background">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="The operating record"
            title="The details that make a financial record reviewable."
            className="max-w-[780px]"
          />
          <p className="max-w-[350px] text-sm leading-6 text-muted-foreground">
            A focused set of controls for the facts that organizations need to preserve.
          </p>
        </div>
        <div className="mt-16 grid grid-flow-dense gap-5 md:grid-cols-12">
          {landingFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
