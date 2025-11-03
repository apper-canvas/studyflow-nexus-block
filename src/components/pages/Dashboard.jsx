import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { calculateGPA, calculateCompletionRate } from "@/utils/gradeUtils";
import { formatDate, isDueSoon, isDueToday, isOverdue } from "@/utils/dateUtils";
import { getColorByValue } from "@/utils/courseColors";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(c => c.Id.toString() === courseId.toString());
  };

  // Dashboard statistics
  const stats = {
    totalCourses: courses.length,
    totalAssignments: assignments.length,
    completedAssignments: assignments.filter(a => a.completed).length,
    pendingAssignments: assignments.filter(a => !a.completed).length,
    overdue: assignments.filter(a => !a.completed && isOverdue(a.dueDate)).length,
    dueToday: assignments.filter(a => !a.completed && isDueToday(a.dueDate)).length,
    dueSoon: assignments.filter(a => !a.completed && isDueSoon(a.dueDate)).length,
    currentGPA: calculateGPA(courses, assignments),
    completionRate: calculateCompletionRate(assignments)
  };

  // Upcoming assignments (next 7 days)
  const upcomingAssignments = assignments
    .filter(a => !a.completed && isDueSoon(a.dueDate))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Today's assignments
  const todaysAssignments = assignments
    .filter(a => isDueToday(a.dueDate))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const handleMarkComplete = async (assignmentId, completed) => {
    try {
      await assignmentService.toggleComplete(assignmentId, completed);
      loadDashboardData();
    } catch (error) {
      console.error("Failed to toggle assignment completion:", error);
    }
  };

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100 text-lg">
              You have {stats.pendingAssignments} pending assignments and {stats.dueToday} due today.
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="GraduationCap" size={64} className="text-primary-100" />
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          subtitle="Active this semester"
          icon="BookOpen"
          color="primary"
        />
        <StatCard
          title="Assignments"
          value={stats.totalAssignments}
          subtitle={`${stats.completedAssignments} completed`}
          icon="ClipboardList"
          color="info"
        />
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          subtitle="Requires immediate attention"
          icon="Clock"
          color="warning"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Past due date"
          icon="AlertTriangle"
          color="danger"
        />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Academic Progress</h3>
              <p className="text-sm text-gray-600">Current semester overview</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <ProgressRing 
                progress={stats.currentGPA * 25} 
                size={100}
                color="primary"
                showPercentage={false}
                label="GPA"
              />
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.currentGPA.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Current GPA</div>
              </div>
            </div>
            
            <div className="text-center">
              <ProgressRing 
                progress={stats.completionRate} 
                size={100}
                color="success"
                label="Complete"
              />
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completedAssignments}/{stats.totalAssignments}
                </div>
                <div className="text-sm text-gray-500">Assignments</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
              <p className="text-sm text-gray-600">{formatDate(new Date(), "EEEE, MMM dd")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon="Calendar"
              onClick={() => navigate("/calendar")}
            >
              View Calendar
            </Button>
          </div>

          {todaysAssignments.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="CheckCircle" size={48} className="text-success-500 mx-auto mb-3" />
              <p className="text-gray-500">No assignments due today!</p>
              <p className="text-sm text-gray-400">Great job staying on top of your work.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysAssignments.map(assignment => {
                const course = getCourseById(assignment.courseId);
                return (
                  <div
                    key={assignment.Id}
                    className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleMarkComplete(assignment.Id, !assignment.completed)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          assignment.completed
                            ? "bg-success-500 border-success-500"
                            : "border-warning-500 hover:border-warning-600"
                        }`}
                      >
                        {assignment.completed && (
                          <ApperIcon name="Check" size={12} className="text-white" />
                        )}
                      </button>
                      
                      {course && (
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                      )}
                      
                      <div>
                        <div className={`font-medium ${
                          assignment.completed ? "line-through text-gray-500" : "text-gray-900"
                        }`}>
                          {assignment.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {course?.name || "Unknown Course"}
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="warning" size="sm">
                      Due Today
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Upcoming Assignments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
            <p className="text-sm text-gray-600">Due in the next 7 days</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon="Plus"
            onClick={() => navigate("/assignments")}
          >
            View All
          </Button>
        </div>

        {upcomingAssignments.length === 0 ? (
          <Empty
            title="No upcoming assignments"
            message="You're all caught up! Check back later or add new assignments."
            actionText="Add Assignment"
            onAction={() => navigate("/assignments")}
            icon="CheckCircle"
            showAction={false}
          />
        ) : (
          <div className="space-y-3">
            {upcomingAssignments.map(assignment => {
              const course = getCourseById(assignment.courseId);
              return (
                <motion.div
                  key={assignment.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleMarkComplete(assignment.Id, !assignment.completed)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        assignment.completed
                          ? "bg-success-500 border-success-500"
                          : "border-gray-300 hover:border-primary-500"
                      }`}
                    >
                      {assignment.completed && (
                        <ApperIcon name="Check" size={12} className="text-white" />
                      )}
                    </button>
                    
                    {course && (
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                    )}
                    
                    <div>
                      <div className={`font-medium ${
                        assignment.completed ? "line-through text-gray-500" : "text-gray-900"
                      }`}>
                        {assignment.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {course?.name || "Unknown Course"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={assignment.priority === "high" ? "danger" : 
                             assignment.priority === "medium" ? "warning" : "info"}
                      size="sm"
                    >
                      {assignment.priority}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {formatDate(assignment.dueDate, "MMM dd")}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="primary"
          size="lg"
          icon="Plus"
          onClick={() => navigate("/assignments")}
          className="justify-center"
        >
          Add Assignment
        </Button>
        <Button
          variant="outline"
          size="lg"
          icon="BookOpen"
          onClick={() => navigate("/courses")}
          className="justify-center"
        >
          Manage Courses
        </Button>
        <Button
          variant="outline"
          size="lg"
          icon="Trophy"
          onClick={() => navigate("/grades")}
          className="justify-center"
        >
          View Grades
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;