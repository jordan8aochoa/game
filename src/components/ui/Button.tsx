"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size    = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:   "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 focus:ring-brand-500",
  secondary: "bg-white text-surface-700 border border-surface-200 hover:bg-surface-50 hover:border-surface-300 focus:ring-brand-500",
  ghost:     "text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:ring-brand-500",
  danger:    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
  accent:    "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 focus:ring-accent-400",
};

const sizes: Record<Size, string> = {
  sm:   "px-3 py-1.5 text-xs gap-1.5",
  md:   "px-4 py-2.5 text-sm gap-2",
  lg:   "px-6 py-3 text-base gap-2",
  icon: "p-2 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-lg",
          "transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : 16} />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
