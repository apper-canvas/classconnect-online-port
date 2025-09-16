import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-pulse";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500 border border-primary-500",
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-500 shadow-sm hover:shadow-md",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500",
    danger: "bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white shadow-lg hover:shadow-xl focus:ring-error-500 border border-error-500",
    success: "bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-lg hover:shadow-xl focus:ring-success-500 border border-success-500",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white shadow-lg hover:shadow-xl focus:ring-warning-500 border border-warning-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-xl",
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "transform-none hover:shadow-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <ApperIcon name={leftIcon} className="h-4 w-4 mr-2" />}
          {children}
          {rightIcon && <ApperIcon name={rightIcon} className="h-4 w-4 ml-2" />}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;