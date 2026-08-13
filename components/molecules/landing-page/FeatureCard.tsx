import type { LandingFeature } from "@/lib/constants/landing-page";
import { ArrowIcon } from "@/components/atoms/landing-page/ArrowIcon";

type FeatureCardProps = LandingFeature;

const toneClasses = {
  paper: {
    surface: "bg-white text-primary",
    label: "text-secondary",
    body: "text-muted-foreground",
  },
  navy: {
    surface: "bg-primary text-white",
    label: "text-indigo-100",
    body: "text-white/70",
  },
  indigo: {
    surface: "bg-secondary text-white",
    label: "text-indigo-100",
    body: "text-white/75",
  },
  mist: {
    surface: "bg-slate-100 text-primary",
    label: "text-secondary",
    body: "text-muted-foreground",
  },
} as const;

export function FeatureCard({ description, label, span, title, tone }: FeatureCardProps) {
  const styles = toneClasses[tone];

  return (
    <article
      className={`${span} group flex min-h-[276px] flex-col justify-between overflow-hidden rounded-lg border border-slate-200 p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9 ${styles.surface}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${styles.label}`}>
          {label}
        </p>
        <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
      <div className="mt-12 max-w-[620px]">
        <h3 className="text-2xl font-semibold leading-tight tracking-[-0.05em] sm:text-3xl">
          {title}
        </h3>
        <p className={`mt-4 max-w-[580px] text-sm leading-6 ${styles.body}`}>
          {description}
        </p>
      </div>
    </article>
  );
}
