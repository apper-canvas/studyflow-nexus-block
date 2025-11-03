import { courseColors } from "@/utils/courseColors";
import { cn } from "@/utils/cn";

const CourseColorPicker = ({ selectedColor, onColorChange, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        Course Color
      </label>
      <div className="grid grid-cols-8 gap-2">
        {courseColors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all duration-200",
              selectedColor === color.value
                ? "border-gray-900 scale-110 shadow-lg"
                : "border-gray-300 hover:border-gray-400 hover:scale-105"
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseColorPicker;