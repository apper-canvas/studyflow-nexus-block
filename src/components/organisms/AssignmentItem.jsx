import { motion } from "framer-motion";
import { useState } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import DueDateBadge from "@/components/molecules/DueDateBadge";
import ApperIcon from "@/components/ApperIcon";
import { formatDate } from "@/utils/dateUtils";
import { getColorByValue } from "@/utils/courseColors";

const AssignmentItem = ({ 
  assignment, 
  course, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const courseColor = course ? getColorByValue(course.color) : null;

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(assignment.Id, !assignment.completed);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(assignment);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(assignment);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 ${assignment.completed ? "opacity-75" : ""}`}>
        <div className="flex items-center space-x-4">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={isCompleting}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              assignment.completed
                ? "bg-success-500 border-success-500"
                : "border-gray-300 hover:border-primary-500"
            } ${isCompleting ? "opacity-50" : ""}`}
          >
            {assignment.completed && (
              <ApperIcon name="Check" size={14} className="text-white" />
            )}
          </button>

          {/* Course indicator */}
          {course && (
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: course.color }}
              title={course.name}
            />
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${
                  assignment.completed 
                    ? "line-through text-gray-500" 
                    : "text-gray-900"
                }`}>
                  {assignment.title}
                </h3>
                
                {assignment.description && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {assignment.description}
                  </p>
                )}

                <div className="flex items-center space-x-3 mt-2">
                  {course && (
                    <Badge 
                      variant="default" 
                      size="sm"
                      style={{ 
                        backgroundColor: `${course.color}20`,
                        color: course.color,
                        borderColor: `${course.color}40`
                      }}
                    >
                      {course.name}
                    </Badge>
                  )}
                  
                  <DueDateBadge dueDate={assignment.dueDate} />
                  <PriorityBadge priority={assignment.priority} />
                  
                  {assignment.type && (
                    <Badge variant="default" size="sm">
                      {assignment.type}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 ml-4">
                <div className="text-xs text-gray-500">
                  {formatDate(assignment.dueDate, "MMM dd")}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AssignmentItem;