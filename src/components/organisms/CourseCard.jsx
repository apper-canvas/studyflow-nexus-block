import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatTime } from "@/utils/dateUtils";
import { getColorByValue } from "@/utils/courseColors";

const CourseCard = ({ course, assignmentCount = 0, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const colorConfig = getColorByValue(course.color);

  const handleCardClick = () => {
    navigate(`/courses/${course.Id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(course);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(course);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-6 cursor-pointer relative overflow-hidden group"
        onClick={handleCardClick}
      >
        {/* Course color indicator */}
        <div 
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: course.color }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: course.color }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600">
                {course.instructor}
              </p>
            </div>
          </div>

          {/* Actions */}
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

        {/* Course info */}
        <div className="space-y-3">
          {/* Credits */}
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Hash" size={16} className="mr-2" />
            {course.credits} Credits
          </div>

          {/* Schedule */}
          {course.schedule && course.schedule.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Clock" size={16} className="mr-2" />
                Schedule
              </div>
              <div className="space-y-1">
                {course.schedule.slice(0, 2).map((scheduleItem, index) => (
                  <div key={index} className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="font-medium">
                      {scheduleItem.day}
                    </span>
                    <span>
                      {formatTime(scheduleItem.startTime)} - {formatTime(scheduleItem.endTime)}
                    </span>
                    {scheduleItem.location && (
                      <span className="text-gray-400">
                        {scheduleItem.location}
                      </span>
                    )}
                  </div>
                ))}
                {course.schedule.length > 2 && (
                  <div className="text-xs text-gray-400 text-center">
                    +{course.schedule.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignment count */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="FileText" size={16} className="mr-2" />
              {assignmentCount} Assignments
            </div>
            
            <Badge variant="primary" size="sm">
              {course.semester}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;