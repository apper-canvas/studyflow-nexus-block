import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CourseCard from "@/components/organisms/CourseCard";
import CourseModal from "@/components/organisms/CourseModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

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

  const getAssignmentCountForCourse = (courseId) => {
    return assignments.filter(a => a.courseId === courseId.toString()).length;
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleDeleteCourse = async (course) => {
    const courseAssignments = assignments.filter(a => a.courseId === course.Id.toString());
    
    const confirmMessage = courseAssignments.length > 0
      ? `Are you sure you want to delete "${course.name}"? This will also delete ${courseAssignments.length} associated assignments.`
      : `Are you sure you want to delete "${course.name}"?`;

    if (window.confirm(confirmMessage)) {
      try {
        await courseService.delete(course.Id);
        
        // Delete associated assignments
        if (courseAssignments.length > 0) {
          await Promise.all(
            courseAssignments.map(assignment => 
              assignmentService.delete(assignment.Id)
            )
          );
        }
        
        toast.success("Course deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete course. Please try again.");
      }
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await courseService.update(editingCourse.Id, courseData);
      } else {
        await courseService.create(courseData);
      }
      loadData();
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">
            Manage your {courses.length} course{courses.length !== 1 ? "s" : ""} this semester
          </p>
        </div>

        <Button
          icon="Plus"
          onClick={handleAddCourse}
          className="shrink-0"
        >
          Add Course
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            type="text"
            placeholder="Search courses by name or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        searchTerm ? (
          <Empty
            title="No courses found"
            message={`No courses match "${searchTerm}". Try adjusting your search.`}
            icon="Search"
            showAction={false}
          />
        ) : (
          <Empty
            title="No courses yet"
            message="Start by adding your first course to begin organizing your academic schedule."
            actionText="Add Your First Course"
            onAction={handleAddCourse}
            icon="BookOpen"
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <CourseCard
                  course={course}
                  assignmentCount={getAssignmentCountForCourse(course.Id)}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        course={editingCourse}
        onSave={handleSaveCourse}
      />
    </div>
  );
};

export default Courses;