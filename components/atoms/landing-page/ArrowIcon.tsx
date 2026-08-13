import { ArrowUpRight } from "lucide-react";

type ArrowIconProps = {
  className?: string;
};

export function ArrowIcon({ className }: ArrowIconProps) {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className={className}
      size={18}
      strokeWidth={1.8}
    />
  );
}
