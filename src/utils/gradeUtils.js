export const calculateGPA = (courses, assignments) => {
  if (!courses.length) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const courseAssignments = assignments.filter(a => 
      a.courseId === course.Id && a.grade !== null && a.grade !== undefined
    );

    if (courseAssignments.length === 0) return;

    const totalWeight = courseAssignments.reduce((sum, a) => sum + (a.weight || 1), 0);
    const weightedScore = courseAssignments.reduce((sum, a) => 
      sum + (a.grade * (a.weight || 1)), 0
    );

    const courseGrade = totalWeight > 0 ? weightedScore / totalWeight : 0;
    const gradePoints = getGradePoints(courseGrade);
    
    totalPoints += gradePoints * course.credits;
    totalCredits += course.credits;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

export const calculateCourseGrade = (assignments) => {
  const gradedAssignments = assignments.filter(a => 
    a.grade !== null && a.grade !== undefined
  );

  if (gradedAssignments.length === 0) return null;

  const totalWeight = gradedAssignments.reduce((sum, a) => sum + (a.weight || 1), 0);
  const weightedScore = gradedAssignments.reduce((sum, a) => 
    sum + (a.grade * (a.weight || 1)), 0
  );

  return totalWeight > 0 ? weightedScore / totalWeight : 0;
};

export const getGradePoints = (percentage) => {
  if (percentage >= 97) return 4.0;
  if (percentage >= 93) return 3.7;
  if (percentage >= 90) return 3.3;
  if (percentage >= 87) return 3.0;
  if (percentage >= 83) return 2.7;
  if (percentage >= 80) return 2.3;
  if (percentage >= 77) return 2.0;
  if (percentage >= 73) return 1.7;
  if (percentage >= 70) return 1.3;
  if (percentage >= 67) return 1.0;
  if (percentage >= 65) return 0.7;
  return 0.0;
};

export const getLetterGrade = (percentage) => {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 65) return "D";
  return "F";
};

export const getGradeColor = (percentage) => {
  if (percentage >= 90) return "text-success-600";
  if (percentage >= 80) return "text-info-600";
  if (percentage >= 70) return "text-warning-600";
  return "text-danger-600";
};

export const calculateCompletionRate = (assignments) => {
  if (assignments.length === 0) return 0;
  const completedCount = assignments.filter(a => a.completed).length;
  return (completedCount / assignments.length) * 100;
};