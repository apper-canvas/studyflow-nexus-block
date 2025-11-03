import coursesData from "@/services/mockData/courses.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get courses from localStorage or use default data
const getCourses = () => {
  const stored = localStorage.getItem("studyflow_courses");
  return stored ? JSON.parse(stored) : [...coursesData];
};

// Save courses to localStorage
const saveCourses = (courses) => {
  localStorage.setItem("studyflow_courses", JSON.stringify(courses));
};

export const courseService = {
  async getAll() {
    await delay(300);
    try {
      return getCourses();
    } catch (error) {
      throw new Error("Failed to fetch courses");
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const courses = getCourses();
      const course = courses.find(c => c.Id === parseInt(id));
      if (!course) {
        throw new Error("Course not found");
      }
      return course;
    } catch (error) {
      throw new Error("Failed to fetch course");
    }
  },

  async create(courseData) {
    await delay(400);
    try {
      const courses = getCourses();
      const maxId = courses.length > 0 ? Math.max(...courses.map(c => c.Id)) : 0;
      
      const newCourse = {
        ...courseData,
        Id: maxId + 1,
        createdAt: new Date().toISOString()
      };
      
      const updatedCourses = [...courses, newCourse];
      saveCourses(updatedCourses);
      return newCourse;
    } catch (error) {
      throw new Error("Failed to create course");
    }
  },

  async update(id, courseData) {
    await delay(400);
    try {
      const courses = getCourses();
      const index = courses.findIndex(c => c.Id === parseInt(id));
      
      if (index === -1) {
        throw new Error("Course not found");
      }
      
      const updatedCourse = {
        ...courses[index],
        ...courseData,
        Id: parseInt(id)
      };
      
      const updatedCourses = [...courses];
      updatedCourses[index] = updatedCourse;
      saveCourses(updatedCourses);
      return updatedCourse;
    } catch (error) {
      throw new Error("Failed to update course");
    }
  },

  async delete(id) {
    await delay(300);
    try {
      const courses = getCourses();
      const filteredCourses = courses.filter(c => c.Id !== parseInt(id));
      
      if (filteredCourses.length === courses.length) {
        throw new Error("Course not found");
      }
      
      saveCourses(filteredCourses);
      return true;
    } catch (error) {
      throw new Error("Failed to delete course");
    }
  }
};