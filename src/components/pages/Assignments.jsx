import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import AssignmentItem from "@/components/organisms/AssignmentItem";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { formatDate, isOverdue, isDueToday } from "@/utils/dateUtils";

const Assignments = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

  // Filter and sort assignments
  const filteredAssignments = assignments
    .filter(assignment => {
      const course = getCourseById(assignment.courseId);
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = !filterCourse || assignment.courseId === filterCourse;
      
      const matchesStatus = !filterStatus || 
        (filterStatus === "completed" && assignment.completed) ||
        (filterStatus === "pending" && !assignment.completed) ||
        (filterStatus === "overdue" && !assignment.completed && isOverdue(assignment.dueDate)) ||
        (filterStatus === "due-today" && isDueToday(assignment.dueDate));
      
      const matchesPriority = !filterPriority || assignment.priority === filterPriority;
      
      return matchesSearch && matchesCourse && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "course":
          const courseA = getCourseById(a.courseId)?.name || "";
          const courseB = getCourseById(b.courseId)?.name || "";
          return courseA.localeCompare(courseB);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Group assignments by status/date
  const groupedAssignments = () => {
    const groups = {
      overdue: [],
      dueToday: [],
      upcoming: [],
      completed: []
    };

    filteredAssignments.forEach(assignment => {
      if (assignment.completed) {
        groups.completed.push(assignment);
      } else if (isOverdue(assignment.dueDate)) {
        groups.overdue.push(assignment);
      } else if (isDueToday(assignment.dueDate)) {
        groups.dueToday.push(assignment);
      } else {
        groups.upcoming.push(assignment);
      }
    });

    return groups;
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setShowModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowModal(true);
  };

  const handleDeleteAssignment = async (assignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      try {
        await assignmentService.delete(assignment.Id);
        toast.success("Assignment deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete assignment. Please try again.");
      }
    }
  };

  const handleToggleComplete = async (assignmentId, completed) => {
    try {
      await assignmentService.toggleComplete(assignmentId, completed);
      toast.success(completed ? "Assignment marked as completed!" : "Assignment marked as pending");
      loadData();
    } catch (error) {
      toast.error("Failed to update assignment. Please try again.");
    }
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        await assignmentService.update(editingAssignment.Id, assignmentData);
      } else {
        await assignmentService.create(assignmentData);
      }
      loadData();
    } catch (error) {
      throw error;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCourse("");
    setFilterStatus("");
    setFilterPriority("");
    setSortBy("dueDate");
  };

  const groups = groupedAssignments();

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">
            {assignments.filter(a => !a.completed).length} pending • {assignments.filter(a => a.completed).length} completed
          </p>
        </div>

        <Button
          icon="Plus"
          onClick={handleAddAssignment}
          className="shrink-0"
        >
          Add Assignment
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <Input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id.toString()}>
                {course.name}
              </option>
            ))}
          </Select>

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="due-today">Due Today</option>
            <option value="overdue">Overdue</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>

          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="course">Sort by Course</option>
            <option value="title">Sort by Title</option>
          </Select>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </p>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        assignments.length === 0 ? (
          <Empty
            title="No assignments yet"
            message="Start by adding your first assignment to track your academic workload."
            actionText="Add Your First Assignment"
            onAction={handleAddAssignment}
            icon="ClipboardList"
          />
        ) : (
          <Empty
            title="No assignments match your filters"
            message="Try adjusting your search criteria or clear the filters to see all assignments."
            actionText="Clear Filters"
            onAction={clearFilters}
            icon="Filter"
          />
        )
      ) : (
        <div className="space-y-8">
          {/* Overdue Assignments */}
          {groups.overdue.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="AlertTriangle" size={20} className="text-danger-500" />
                <h2 className="text-lg font-semibold text-danger-700">
                  Overdue ({groups.overdue.length})
                </h2>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {groups.overdue.map(assignment => (
                    <AssignmentItem
                      key={assignment.Id}
                      assignment={assignment}
                      course={getCourseById(assignment.courseId)}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditAssignment}
                      onDelete={handleDeleteAssignment}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Due Today */}
          {groups.dueToday.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Clock" size={20} className="text-warning-500" />
                <h2 className="text-lg font-semibold text-warning-700">
                  Due Today ({groups.dueToday.length})
                </h2>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {groups.dueToday.map(assignment => (
                    <AssignmentItem
                      key={assignment.Id}
                      assignment={assignment}
                      course={getCourseById(assignment.courseId)}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditAssignment}
                      onDelete={handleDeleteAssignment}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Upcoming Assignments */}
          {groups.upcoming.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Calendar" size={20} className="text-info-500" />
                <h2 className="text-lg font-semibold text-info-700">
                  Upcoming ({groups.upcoming.length})
                </h2>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {groups.upcoming.map(assignment => (
                    <AssignmentItem
                      key={assignment.Id}
                      assignment={assignment}
                      course={getCourseById(assignment.courseId)}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditAssignment}
                      onDelete={handleDeleteAssignment}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completed Assignments */}
          {groups.completed.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="CheckCircle" size={20} className="text-success-500" />
                <h2 className="text-lg font-semibold text-success-700">
                  Completed ({groups.completed.length})
                </h2>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {groups.completed.map(assignment => (
                    <AssignmentItem
                      key={assignment.Id}
                      assignment={assignment}
                      course={getCourseById(assignment.courseId)}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditAssignment}
                      onDelete={handleDeleteAssignment}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        assignment={editingAssignment}
        onSave={handleSaveAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Assignments;