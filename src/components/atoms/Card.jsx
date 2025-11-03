import { cn } from "@/utils/cn";

const Card = ({ 
  children, 
  className, 
  hover = false,
  gradient = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        hover && "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;