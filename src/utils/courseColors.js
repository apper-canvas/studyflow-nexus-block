export const courseColors = [
  { name: "Indigo", value: "#4F46E5", bg: "bg-indigo-500", text: "text-white" },
  { name: "Purple", value: "#7C3AED", bg: "bg-purple-500", text: "text-white" },
  { name: "Pink", value: "#EC4899", bg: "bg-pink-500", text: "text-white" },
  { name: "Red", value: "#EF4444", bg: "bg-red-500", text: "text-white" },
  { name: "Orange", value: "#F97316", bg: "bg-orange-500", text: "text-white" },
  { name: "Amber", value: "#F59E0B", bg: "bg-amber-500", text: "text-white" },
  { name: "Yellow", value: "#EAB308", bg: "bg-yellow-500", text: "text-black" },
  { name: "Lime", value: "#84CC16", bg: "bg-lime-500", text: "text-black" },
  { name: "Green", value: "#10B981", bg: "bg-green-500", text: "text-white" },
  { name: "Emerald", value: "#059669", bg: "bg-emerald-500", text: "text-white" },
  { name: "Teal", value: "#14B8A6", bg: "bg-teal-500", text: "text-white" },
  { name: "Cyan", value: "#06B6D4", bg: "bg-cyan-500", text: "text-white" },
  { name: "Sky", value: "#0EA5E9", bg: "bg-sky-500", text: "text-white" },
  { name: "Blue", value: "#3B82F6", bg: "bg-blue-500", text: "text-white" },
  { name: "Rose", value: "#F43F5E", bg: "bg-rose-500", text: "text-white" },
  { name: "Slate", value: "#64748B", bg: "bg-slate-500", text: "text-white" },
];

export const getRandomColor = () => {
  return courseColors[Math.floor(Math.random() * courseColors.length)];
};

export const getColorByValue = (value) => {
  return courseColors.find(color => color.value === value) || courseColors[0];
};