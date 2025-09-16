import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  className = "",
  children,
  hover = false,
  gradient = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-200",
        "transition-all duration-300",
        hover && "card-hover cursor-pointer",
        gradient && "bg-gradient-to-br from-white via-slate-50 to-blue-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;