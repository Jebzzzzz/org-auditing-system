import { SectionHeading } from "@/components/molecules/landing-page/SectionHeading";
import { landingAccountabilitySteps } from "@/lib/constants/landing-page";

export function AccountabilitySection() {
  return (
    <section id="accountability" className="border-b border-slate-200 bg-slate-100">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24 lg:px-12 lg:py-40">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Built for accountable work"
            title="Every action leaves a useful trail."
            className="max-w-[520px]"
          />
          <p className="mt-7 max-w-[500px] text-lg leading-8 text-muted-foreground">
            The path from officer action to reviewable report stays connected without asking people to reconstruct the story by hand.
          </p>
        </div>
        <ol className="relative border-l border-slate-300 pl-6 sm:pl-10">
          {landingAccountabilitySteps.map((step, index) => (
            <li key={step.title} className="group relative pb-14 last:pb-0 sm:pb-20">
              {index < landingAccountabilitySteps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.65rem] top-10 h-[calc(100%-1.5rem)] border-l border-dashed border-secondary/50 sm:-left-[2.65rem]"
                />
              ) : null}
              <div className="relative grid gap-5 sm:grid-cols-[5rem_1fr] sm:gap-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-secondary/30 bg-white font-mono text-sm font-semibold tabular-nums text-secondary shadow-sm">
                  {step.mark}
                </span>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-primary sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[600px] text-base leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
