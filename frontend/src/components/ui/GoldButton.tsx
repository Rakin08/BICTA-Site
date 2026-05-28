"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "solid" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface GoldButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "bg-bicta-gold text-bicta-void hover:scale-[1.02] hover:shadow-cta-glow active:scale-[0.99]",
  outline:
    "border border-bicta-gold text-bicta-gold hover:text-bicta-gold-lt hover:border-bicta-gold-lt bg-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-[0.75rem] px-5 py-2.5",
  md: "text-[0.875rem] px-8 py-3.5",
  lg: "text-[1rem] px-10 py-4",
};

export default function GoldButton({
  children,
  href,
  onClick,
  variant = "solid",
  size = "md",
  className,
  external = false,
  disabled = false,
  type = "button",
}: GoldButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-body font-medium uppercase tracking-[0.08em]",
    "transition-all duration-250 select-none",
    "rounded-none", // sharp corners per design system
    variantClasses[variant],
    sizeClasses[size],
    disabled && "opacity-50 pointer-events-none",
    className
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
