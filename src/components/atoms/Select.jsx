import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({
  className = "",
  label,
  error,
  helper,
  children,
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
        <select
          ref={ref}
          className={cn(
            "block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900",
            "focus:border-primary-500 focus:outline-none focus:ring-0",
            "transition-all duration-200 appearance-none",
            "bg-white shadow-sm hover:shadow-md pr-10",
            error && "border-error-500 focus:border-error-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ApperIcon name="ChevronDown" className="h-4 w-4 text-slate-400" />
        </div>
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

Select.displayName = "Select";

export default Select;