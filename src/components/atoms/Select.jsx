import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  required = false,
  children,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white",
          "text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "transition-colors duration-200",
          error && "border-danger-500 focus:ring-danger-500 focus:border-danger-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
      
      {error && (
        <p className="text-sm text-danger-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;