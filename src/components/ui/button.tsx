import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[#16A34A] text-white hover:bg-[#15803D] focus-visible:ring-[#16A34A] shadow-sm active:bg-[#166534]",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 active:bg-gray-300",
  outline:
    "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-[#16A34A] shadow-sm",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 shadow-sm active:bg-rose-800",
  ghost:
    "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-300",
  link:
    "text-[#16A34A] underline-offset-4 hover:underline p-0 h-auto font-medium",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-9 px-4 text-sm rounded-lg",
  lg: "h-11 px-6 text-base rounded-lg",
  icon: "h-9 w-9 p-0 rounded-lg flex items-center justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none gap-2 select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
