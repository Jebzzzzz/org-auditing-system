import type { ReactNode } from "react";

import { ArrowIcon } from "@/components/atoms/landing-page/ArrowIcon";
import { focusRing } from "@/components/atoms/landing-page/FocusRing";

type ArrowLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
};

export function ArrowLink({ children, href, className = "" }: ArrowLinkProps) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-primary transition-colors hover:text-secondary ${focusRing} ${className}`}
    >
      {children}
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300">
        <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </a>
  );
}
