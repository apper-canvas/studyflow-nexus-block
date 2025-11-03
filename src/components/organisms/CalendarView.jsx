import { useState, useMemo } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from "date-fns";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { getColorByValue } from "@/utils/courseColors";
import { isDueToday, isOverdue } from "@/utils/dateUtils";

const CalendarView = ({ assignments = [], courses = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month or week

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  // Group assignments by date
  const assignmentsByDate = useMemo(() => {
    const grouped = {};
    
    assignments.forEach(assignment => {
      if (!assignment.dueDate) return;
      
      const dateKey = format(parseISO(assignment.dueDate), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(assignment);
    });

    return grouped;
  }, [assignments]);

  const getCourseById = (courseId) => {
    return courses.find(c => c.Id.toString() === courseId.toString());
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Calendar header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-3 text-center">
              <span className="text-sm font-medium text-gray-600">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar body */}
        <div className="divide-y divide-gray-200">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 divide-x divide-gray-200">
              {week.map(day => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayAssignments = assignmentsByDate[dateKey] || [];
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <div 
                    key={day.toString()} 
                    className={cn(
                      "min-h-[120px] p-2",
                      !isCurrentMonth && "bg-gray-50 text-gray-400",
                      isToday && "bg-primary-50"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-2",
                      isToday && "text-primary-600"
                    )}>
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1">
                      {dayAssignments.slice(0, 3).map(assignment => {
                        const course = getCourseById(assignment.courseId);
                        return (
                          <div
                            key={assignment.Id}
                            className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: course ? `${course.color}20` : "#f3f4f6",
                              color: course ? course.color : "#6b7280",
                              borderLeft: `3px solid ${course ? course.color : "#d1d5db"}`
                            }}
                            title={`${assignment.title} - ${course?.name || "Unknown Course"}`}
                          >
                            {assignment.title}
                          </div>
                        );
                      })}
                      
                      {dayAssignments.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayAssignments.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUpcomingAssignments = () => {
    // Get next 7 days of assignments
    const upcomingAssignments = assignments
      .filter(a => a.dueDate && new Date(a.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 10);

    if (upcomingAssignments.length === 0) {
      return (
        <Card className="p-6 text-center">
          <ApperIcon name="Calendar" size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming assignments</p>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {upcomingAssignments.map(assignment => {
          const course = getCourseById(assignment.courseId);
          const dueDate = parseISO(assignment.dueDate);
          
          return (
            <motion.div
              key={assignment.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3">
                  {course && (
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: course.color }}
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {assignment.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {course?.name || "Unknown Course"}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-medium",
                      isDueToday(assignment.dueDate) && "text-warning-600",
                      isOverdue(assignment.dueDate) && "text-danger-600"
                    )}>
                      {format(dueDate, "MMM dd")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(dueDate, "h:mm a")}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <p className="text-gray-600">
            {assignments.length} total assignments
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView("month")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200",
                view === "month" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Month
            </button>
            <button
              onClick={() => setView("upcoming")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200",
                view === "upcoming" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Upcoming
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              icon="ChevronLeft"
              onClick={() => navigateMonth("prev")}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="ChevronRight"
              onClick={() => navigateMonth("next")}
            />
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {view === "month" ? renderMonthView() : renderUpcomingAssignments()}
    </div>
  );
};

export default CalendarView;