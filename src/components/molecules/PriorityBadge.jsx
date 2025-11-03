import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const PriorityBadge = ({ priority, className }) => {
  const priorityConfig = {
    high: { variant: "danger", text: "High Priority" },
    medium: { variant: "warning", text: "Medium Priority" },
    low: { variant: "info", text: "Low Priority" },
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <Badge 
      variant={config.variant}
      className={cn("text-xs font-semibold", className)}
    >
      {config.text}
    </Badge>
  );
};

export default PriorityBadge;