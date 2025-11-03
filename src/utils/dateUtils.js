import { format, differenceInDays, parseISO, startOfDay, endOfDay, isAfter, isBefore, addDays } from "date-fns";

export const formatDate = (date, formatStr = "MMM dd, yyyy") => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatTime = (time) => {
  if (!time) return "";
  return format(parseISO(`2000-01-01T${time}`), "h:mm a");
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const dateObj = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  return differenceInDays(startOfDay(dateObj), startOfDay(new Date()));
};

export const getDueDateColor = (dueDate) => {
  const days = getDaysUntilDue(dueDate);
  if (days === null) return "due-green";
  
  if (days < 0) return "due-red";
  if (days <= 3) return "due-amber";
  return "due-green";
};

export const getDueDateText = (dueDate) => {
  const days = getDaysUntilDue(dueDate);
  if (days === null) return "";
  
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const dateObj = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  return isBefore(endOfDay(dateObj), new Date());
};

export const isDueToday = (dueDate) => {
  if (!dueDate) return false;
  const dateObj = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  const today = new Date();
  return (
    isAfter(dateObj, startOfDay(today)) && 
    isBefore(dateObj, endOfDay(today))
  );
};

export const isDueSoon = (dueDate, days = 7) => {
  if (!dueDate) return false;
  const dateObj = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  const futureDate = addDays(new Date(), days);
  return isBefore(dateObj, endOfDay(futureDate)) && !isOverdue(dueDate);
};

export const getRelativeTimeText = (date) => {
  const days = getDaysUntilDue(date);
  if (days === null) return "";
  
  if (days < -1) return `${Math.abs(days)} days ago`;
  if (days === -1) return "Yesterday";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `In ${days} days`;
  return formatDate(date, "MMM dd");
};