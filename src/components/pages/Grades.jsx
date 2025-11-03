import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { 
  calculateGPA, 
  calculateCourseGrade, 
  getLetterGrade, 
  getGradeColor 
} from "@/utils/gradeUtils";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "react-toastify";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingGrade, setEditingGrade] = useState(null);
  const [gradeInput, setGradeInput] = useState("");

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

  const getAssignmentsByCourse = (courseId) => {
    return assignments.filter(a => a.courseId === courseId.toString());
  };

  const handleEditGrade = (assignment) => {
    setEditingGrade(assignment.Id);
    setGradeInput(assignment.grade?.toString() || "");
  };

  const handleSaveGrade = async (assignmentId) => {
    const grade = parseFloat(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      toast.error("Please enter a valid grade between 0 and 100");
      return;
    }

    try {
      await assignmentService.update(assignmentId, { grade });
      toast.success("Grade updated successfully!");
      setEditingGrade(null);
      setGradeInput("");
      loadData();
    } catch (error) {
      toast.error("Failed to update grade. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingGrade(null);
    setGradeInput("");
  };

  const currentGPA = calculateGPA(courses, assignments);
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (courses.length === 0) {
    return (
      <Empty
        title="No courses to grade"
        message="Add courses and assignments to start tracking your grades."
        actionText="Go to Courses"
        onAction={() => window.location.href = "/courses"}
        icon="Trophy"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* GPA Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <div className="text-center">
            <ProgressRing 
              progress={currentGPA * 25} 
              size={120}
              color="primary"
              showPercentage={false}
              label="GPA"
            />
            <div className="mt-4">
              <div className="text-3xl font-bold text-gray-900">
                {currentGPA.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                Current GPA • {totalCredits} Credits
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {courses.map(course => {
              const courseAssignments = getAssignmentsByCourse(course.Id);
              const courseGrade = calculateCourseGrade(courseAssignments);
              
              return (
                <div key={course.Id} className="text-center">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: course.color }}
                  />
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {course.name}
                  </div>
                  <div className={`text-lg font-bold ${
                    courseGrade !== null ? getGradeColor(courseGrade) : "text-gray-400"
                  }`}>
                    {courseGrade !== null ? getLetterGrade(courseGrade) : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {courseGrade !== null ? `${courseGrade.toFixed(1)}%` : "No grades"}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Course Grades */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Course Grades</h2>
        
        {courses.map(course => {
          const courseAssignments = getAssignmentsByCourse(course.Id);
          const courseGrade = calculateCourseGrade(courseAssignments);
          const gradedAssignments = courseAssignments.filter(a => a.grade !== null && a.grade !== undefined);
          
          return (
            <Card key={course.Id} className="overflow-hidden">
              {/* Course Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.instructor} • {course.credits} Credits
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      courseGrade !== null ? getGradeColor(courseGrade) : "text-gray-400"
                    }`}>
                      {courseGrade !== null ? getLetterGrade(courseGrade) : "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {courseGrade !== null ? `${courseGrade.toFixed(1)}%` : "No grades yet"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignments */}
              <div className="p-6">
                {courseAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="FileText" size={48} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No assignments for this course</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Assignments</h4>
                      <p className="text-sm text-gray-500">
                        {gradedAssignments.length} of {courseAssignments.length} graded
                      </p>
                    </div>
                    
                    {courseAssignments.map(assignment => (
                      <motion.div
                        key={assignment.Id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 truncate">
                                {assignment.title}
                              </h5>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge variant="default" size="sm">
                                  {assignment.type}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Due: {formatDate(assignment.dueDate, "MMM dd")}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Weight: {(assignment.weight * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {assignment.completed && (
                            <ApperIcon name="CheckCircle" size={16} className="text-success-500" />
                          )}
                          
                          {editingGrade === assignment.Id ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0-100"
                                value={gradeInput}
                                onChange={(e) => setGradeInput(e.target.value)}
                                className="w-20"
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                icon="Check"
                                onClick={() => handleSaveGrade(assignment.Id)}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="X"
                                onClick={handleCancelEdit}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div className="text-right min-w-[60px]">
                                {assignment.grade !== null && assignment.grade !== undefined ? (
                                  <div className={`font-bold ${getGradeColor(assignment.grade)}`}>
                                    {assignment.grade.toFixed(1)}%
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-sm">
                                    No grade
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="Edit2"
                                onClick={() => handleEditGrade(assignment)}
                                className="text-gray-400 hover:text-primary-600"
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Grades;