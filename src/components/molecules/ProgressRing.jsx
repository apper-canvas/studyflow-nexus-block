import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = "primary",
  className,
  showPercentage = true,
  label 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    primary: "stroke-primary-500",
    secondary: "stroke-secondary-500",
    success: "stroke-success-500",
    warning: "stroke-warning-500",
    danger: "stroke-danger-500",
    info: "stroke-info-500",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-500 ease-out", colorClasses[color])}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(progress)}%
          </span>
        )}
        {label && (
          <span className="text-sm text-gray-500 font-medium">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;