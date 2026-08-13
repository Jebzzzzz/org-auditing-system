import { ArrowLink } from "@/components/molecules/landing-page/ArrowLink";
import { SectionHeading } from "@/components/molecules/landing-page/SectionHeading";
import { landingContinuityFacts } from "@/lib/constants/landing-page";

export function ContinuitySection() {
  return (
    <section id="how-it-works" className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:px-12 lg:py-40">
        <SectionHeading
          eyebrow="One continuous record"
          title="The handoff should add context, not erase it."
          className="max-w-[520px]"
        />
        <div className="max-w-[760px] border-l border-slate-300 pl-6 text-lg leading-8 text-muted-foreground sm:pl-10">
          <p>Officer turnover changes who is responsible. It should not change why a number exists.</p>
          <p className="mt-7">
            OrgAudit keeps one organization’s financial history structured across semesters so the next Treasurer, Auditor, or President can review the same chain of balances, transactions, transfers, and report versions.
          </p>
          <div className="mt-9">
            <ArrowLink href="#features">See the operating record</ArrowLink>
          </div>
        </div>
      </div>
      <div aria-label="OrgAudit record facts" className="border-t border-slate-200 bg-slate-50">
        <ul className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-slate-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4 lg:px-12">
          {landingContinuityFacts.map((fact) => (
            <li key={fact} className="px-4 py-4 text-center sm:px-6 lg:py-5">
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
