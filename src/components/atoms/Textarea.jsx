import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({
  className = "",
  label,
  error,
  helper,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400",
          "focus:border-primary-500 focus:outline-none focus:ring-0",
          "transition-all duration-200 resize-none",
          "bg-white shadow-sm hover:shadow-md",
          error && "border-error-500 focus:border-error-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-slate-500 mt-1">{helper}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;