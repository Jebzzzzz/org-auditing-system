import { focusRing } from "@/components/atoms/landing-page/FocusRing";

type NavItem = {
  label: string;
  href: string;
};

type NavLinksProps = {
  items: readonly NavItem[];
  hideOnMobile?: boolean;
  className?: string;
};

export function NavLinks({ items, hideOnMobile = true, className = "" }: NavLinksProps) {
  return (
    <div
      className={`${hideOnMobile ? "hidden lg:flex" : "flex"} items-center gap-8 text-sm font-medium text-muted-foreground ${className}`}
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`transition-colors hover:text-primary ${focusRing}`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
