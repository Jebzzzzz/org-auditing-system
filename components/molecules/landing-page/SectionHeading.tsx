import { SectionEyebrow } from "@/components/atoms/landing-page/SectionEyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  className?: string;
  titleClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  className = "",
  titleClassName = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow ? <SectionEyebrow>{eyebrow}</SectionEyebrow> : null}
      <h2
        className={`mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-primary sm:text-6xl ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
}
