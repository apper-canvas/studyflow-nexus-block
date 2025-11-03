import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  className, 
  variant = "default",
  size = "sm",
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-primary-100 text-primary-800 border border-primary-200",
    secondary: "bg-secondary-100 text-secondary-800 border border-secondary-200",
    success: "bg-success-100 text-success-800 border border-success-200",
    warning: "bg-warning-100 text-warning-800 border border-warning-200",
    danger: "bg-danger-100 text-danger-800 border border-danger-200",
    info: "bg-info-100 text-info-800 border border-info-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-sm font-medium",
    lg: "px-3 py-1.5 text-sm font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;