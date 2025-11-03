import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { format } from "date-fns";

const AssignmentModal = ({ isOpen, onClose, assignment, onSave, courses = [] }) => {
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    type: "Assignment",
    weight: 1,
    completed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assignment) {
      const dueDate = assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd'T'HH:mm") : "";
      setFormData({
        courseId: assignment.courseId || "",
        title: assignment.title || "",
        description: assignment.description || "",
        dueDate: dueDate,
        priority: assignment.priority || "medium",
        type: assignment.type || "Assignment",
        weight: assignment.weight || 1,
        completed: assignment.completed || false
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 0, 0);
      
      setFormData({
        courseId: courses.length > 0 ? courses[0].Id.toString() : "",
        title: "",
        description: "",
        dueDate: format(tomorrow, "yyyy-MM-dd'T'HH:mm"),
        priority: "medium",
        type: "Assignment",
        weight: 1,
        completed: false
      });
    }
  }, [assignment, isOpen, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Assignment title is required");
      return;
    }

    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }

    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        weight: parseFloat(formData.weight) || 1
      });
      toast.success(`Assignment ${assignment ? "updated" : "added"} successfully!`);
      onClose();
    } catch (error) {
      toast.error("Failed to save assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  const typeOptions = [
    "Assignment", "Quiz", "Exam", "Project", "Lab", "Discussion", "Paper", "Presentation", "Other"
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignment ? "Edit Assignment" : "Add New Assignment"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Course"
            value={formData.courseId}
            onChange={(e) => handleInputChange("courseId", e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id.toString()}>
                {course.name}
              </option>
            ))}
          </Select>

          <Input
            label="Assignment Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Chapter 5 Review"
            required
          />
        </div>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Additional details about the assignment (optional)"
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Due Date & Time"
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
            required
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleInputChange("priority", e.target.value)}
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
          >
            {typeOptions.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Weight (for grade calculation)"
            type="number"
            min="0"
            step="0.1"
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />

          {assignment && (
            <div className="flex items-center space-x-3 pt-7">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) => handleInputChange("completed", e.target.checked)}
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                Mark as completed
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={isSubmitting}
            icon={assignment ? "Save" : "Plus"}
          >
            {assignment ? "Update Assignment" : "Add Assignment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentModal;