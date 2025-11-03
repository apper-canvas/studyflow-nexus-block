import assignmentsData from "@/services/mockData/assignments.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get assignments from localStorage or use default data
const getAssignments = () => {
  const stored = localStorage.getItem("studyflow_assignments");
  return stored ? JSON.parse(stored) : [...assignmentsData];
};

// Save assignments to localStorage
const saveAssignments = (assignments) => {
  localStorage.setItem("studyflow_assignments", JSON.stringify(assignments));
};

export const assignmentService = {
  async getAll() {
    await delay(300);
    try {
      return getAssignments();
    } catch (error) {
      throw new Error("Failed to fetch assignments");
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const assignments = getAssignments();
      const assignment = assignments.find(a => a.Id === parseInt(id));
      if (!assignment) {
        throw new Error("Assignment not found");
      }
      return assignment;
    } catch (error) {
      throw new Error("Failed to fetch assignment");
    }
  },

  async getByCourseId(courseId) {
    await delay(250);
    try {
      const assignments = getAssignments();
      return assignments.filter(a => a.courseId === courseId.toString());
    } catch (error) {
      throw new Error("Failed to fetch course assignments");
    }
  },

  async create(assignmentData) {
    await delay(400);
    try {
      const assignments = getAssignments();
      const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0;
      
      const newAssignment = {
        ...assignmentData,
        Id: maxId + 1,
        createdAt: new Date().toISOString()
      };
      
      const updatedAssignments = [...assignments, newAssignment];
      saveAssignments(updatedAssignments);
      return newAssignment;
    } catch (error) {
      throw new Error("Failed to create assignment");
    }
  },

  async update(id, assignmentData) {
    await delay(400);
    try {
      const assignments = getAssignments();
      const index = assignments.findIndex(a => a.Id === parseInt(id));
      
      if (index === -1) {
        throw new Error("Assignment not found");
      }
      
      const updatedAssignment = {
        ...assignments[index],
        ...assignmentData,
        Id: parseInt(id)
      };
      
      const updatedAssignments = [...assignments];
      updatedAssignments[index] = updatedAssignment;
      saveAssignments(updatedAssignments);
      return updatedAssignment;
    } catch (error) {
      throw new Error("Failed to update assignment");
    }
  },

  async delete(id) {
    await delay(300);
    try {
      const assignments = getAssignments();
      const filteredAssignments = assignments.filter(a => a.Id !== parseInt(id));
      
      if (filteredAssignments.length === assignments.length) {
        throw new Error("Assignment not found");
      }
      
      saveAssignments(filteredAssignments);
      return true;
    } catch (error) {
      throw new Error("Failed to delete assignment");
    }
  },

  async toggleComplete(id, completed) {
    await delay(200);
    try {
      const assignments = getAssignments();
      const index = assignments.findIndex(a => a.Id === parseInt(id));
      
      if (index === -1) {
        throw new Error("Assignment not found");
      }
      
      const updatedAssignment = {
        ...assignments[index],
        completed
      };
      
      const updatedAssignments = [...assignments];
      updatedAssignments[index] = updatedAssignment;
      saveAssignments(updatedAssignments);
      return updatedAssignment;
    } catch (error) {
      throw new Error("Failed to toggle assignment completion");
    }
  }
};