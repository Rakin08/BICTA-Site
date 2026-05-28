import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Overline eyebrow label used above every section heading.
 * Renders: font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-subtle
 */
export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-subtle",
        className
      )}
    >
      {children}
    </span>
  );
}
