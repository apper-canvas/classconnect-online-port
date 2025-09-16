import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({
  className = "",
  variant = "default",
  size = "md",
  children,
  ...props
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-200",
    success: "bg-gradient-to-r from-success-100 to-success-200 text-success-800 border border-success-200",
    warning: "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border border-warning-200",
    error: "bg-gradient-to-r from-error-100 to-error-200 text-error-800 border border-error-200",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;