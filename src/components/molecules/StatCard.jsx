import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  trend,
  className,
  ...props
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    success: "from-success-500 to-success-600",
    warning: "from-warning-500 to-warning-600",
    danger: "from-danger-500 to-danger-600",
    info: "from-info-500 to-info-600",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn("p-6 relative overflow-hidden", className)}
        {...props}
      >
        {/* Background gradient */}
        <div className={cn(
          "absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full transform translate-x-8 -translate-y-8",
          colorClasses[color]
        )} />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
            {icon && (
              <div className={cn(
                "p-2 rounded-lg bg-gradient-to-br",
                colorClasses[color]
              )}>
                <ApperIcon name={icon} size={20} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl font-bold text-gray-900">
              {value}
            </div>
            
            {subtitle && (
              <p className="text-sm text-gray-500">
                {subtitle}
              </p>
            )}
            
            {trend && (
              <div className={cn(
                "flex items-center text-sm font-medium",
                trend.type === "up" ? "text-success-600" : "text-danger-600"
              )}>
                <ApperIcon 
                  name={trend.type === "up" ? "TrendingUp" : "TrendingDown"} 
                  size={16} 
                  className="mr-1" 
                />
                {trend.value}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;