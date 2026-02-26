import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive-ghost";
type ButtonSize = "lg" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary/50",
  secondary:
    "border border-on-surface/20 text-on-surface/80 hover:bg-on-surface/5 focus-visible:ring-on-surface/30",
  ghost: "text-on-surface-muted hover:text-on-surface/70 focus-visible:ring-on-surface/30",
  "destructive-ghost": "text-destructive hover:text-destructive/80",
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "h-14 rounded-2xl text-base font-semibold",
  md: "rounded-xl px-6 py-3 text-sm font-semibold",
  sm: "h-11 rounded-xl text-sm font-medium",
};

export function Button({ variant = "primary", size = "lg", className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ""}`}
      {...props}
    />
  );
}
