/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";

const base =
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate";

const variantClasses = {
  default: "border-transparent bg-primary text-primary-foreground shadow-xs",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow-xs",
  outline: "border [border-color:var(--badge-outline)] shadow-xs",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <div className={cn(base, variantClasses[variant], className)} {...props} />
  );
}

export default Badge;


