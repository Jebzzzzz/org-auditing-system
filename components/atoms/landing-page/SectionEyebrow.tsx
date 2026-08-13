type SectionEyebrowProps = {
  children: string;
  className?: string;
};

export function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.2em] text-secondary ${className}`}
    >
      {children}
    </p>
  );
}
