import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import CourseColorPicker from "@/components/molecules/CourseColorPicker";
import ApperIcon from "@/components/ApperIcon";
import { getRandomColor } from "@/utils/courseColors";

const CourseModal = ({ isOpen, onClose, course, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    color: "#4F46E5",
    credits: 3,
    semester: "Fall 2024",
    schedule: []
  });

  const [schedule, setSchedule] = useState([{
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    location: ""
  }]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || "",
        instructor: course.instructor || "",
        color: course.color || "#4F46E5",
        credits: course.credits || 3,
        semester: course.semester || "Fall 2024",
        schedule: course.schedule || []
      });
      setSchedule(course.schedule && course.schedule.length > 0 ? course.schedule : [{
        day: "Monday",
        startTime: "09:00",
        endTime: "10:30",
        location: ""
      }]);
    } else {
      const randomColor = getRandomColor();
      setFormData({
        name: "",
        instructor: "",
        color: randomColor.value,
        credits: 3,
        semester: "Fall 2024",
        schedule: []
      });
      setSchedule([{
        day: "Monday",
        startTime: "09:00",
        endTime: "10:30",
        location: ""
      }]);
    }
  }, [course, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Course name is required");
      return;
    }

    if (!formData.instructor.trim()) {
      toast.error("Instructor name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        schedule: schedule.filter(s => s.day && s.startTime && s.endTime)
      });
      toast.success(`Course ${course ? "updated" : "added"} successfully!`);
      onClose();
    } catch (error) {
      toast.error("Failed to save course. Please try again.");
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

  const handleScheduleChange = (index, field, value) => {
    setSchedule(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addScheduleSlot = () => {
    setSchedule(prev => [...prev, {
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      location: ""
    }]);
  };

  const removeScheduleSlot = (index) => {
    setSchedule(prev => prev.filter((_, i) => i !== index));
  };

  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const semesters = [
    "Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025", "Spring 2026"
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course ? "Edit Course" : "Add New Course"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Course Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Computer Science 101"
            required
          />

          <Input
            label="Instructor"
            value={formData.instructor}
            onChange={(e) => handleInputChange("instructor", e.target.value)}
            placeholder="e.g., Dr. Smith"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Credits"
            type="number"
            min="1"
            max="6"
            value={formData.credits}
            onChange={(e) => handleInputChange("credits", parseInt(e.target.value))}
          />

          <Select
            label="Semester"
            value={formData.semester}
            onChange={(e) => handleInputChange("semester", e.target.value)}
          >
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </Select>
        </div>

        <CourseColorPicker
          selectedColor={formData.color}
          onColorChange={(color) => handleInputChange("color", color)}
        />

        {/* Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Schedule</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon="Plus"
              onClick={addScheduleSlot}
            >
              Add Time Slot
            </Button>
          </div>

          <div className="space-y-3">
            {schedule.map((slot, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-3">
                  <Select
                    value={slot.day}
                    onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </Select>
                </div>

                <div className="col-span-2">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                  />
                </div>

                <div className="col-span-4">
                  <Input
                    value={slot.location}
                    onChange={(e) => handleScheduleChange(index, "location", e.target.value)}
                    placeholder="Location (optional)"
                  />
                </div>

                <div className="col-span-1">
                  {schedule.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => removeScheduleSlot(index)}
                      className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
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
            icon={course ? "Save" : "Plus"}
          >
            {course ? "Update Course" : "Add Course"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseModal;