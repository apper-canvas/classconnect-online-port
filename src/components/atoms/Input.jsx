import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  className = "",
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  type = "text",
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-400">{leftIcon}</span>
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400",
            "focus:border-primary-500 focus:outline-none focus:ring-0",
            "transition-all duration-200",
            "bg-white shadow-sm hover:shadow-md",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-error-500 focus:border-error-500",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-400">{rightIcon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-slate-500 mt-1">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;