import Badge from "@/components/atoms/Badge";
import { getDueDateColor, getDueDateText } from "@/utils/dateUtils";
import { cn } from "@/utils/cn";

const DueDateBadge = ({ dueDate, className }) => {
  const colorClass = getDueDateColor(dueDate);
  const text = getDueDateText(dueDate);

  if (!text) return null;

  const variantMap = {
    "due-green": "success",
    "due-amber": "warning", 
    "due-red": "danger",
  };

  return (
    <Badge 
      variant={variantMap[colorClass] || "default"}
      className={cn("text-xs font-medium", className)}
    >
      {text}
    </Badge>
  );
};

export default DueDateBadge;