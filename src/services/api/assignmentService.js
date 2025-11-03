import { toast } from "react-toastify";

const tableName = 'assignment_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const assignmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI field names for compatibility
      const assignments = response.data?.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id ? assignment.course_id_c.Id.toString() : "",
        title: assignment.title_c || "",
        description: assignment.description_c || "",
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c || "medium",
        completed: assignment.completed_c || false,
        grade: assignment.grade_c,
        weight: assignment.weight_c || 1,
        type: assignment.type_c || "Assignment",
        createdAt: assignment.CreatedOn
      })) || [];

      return assignments;
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      toast.error("Failed to fetch assignments");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        toast.error("Assignment not found");
        return null;
      }

      // Transform database fields to UI field names
      const assignment = {
        Id: response.data.Id,
        courseId: response.data.course_id_c?.Id ? response.data.course_id_c.Id.toString() : "",
        title: response.data.title_c || "",
        description: response.data.description_c || "",
        dueDate: response.data.due_date_c,
        priority: response.data.priority_c || "medium",
        completed: response.data.completed_c || false,
        grade: response.data.grade_c,
        weight: response.data.weight_c || 1,
        type: response.data.type_c || "Assignment",
        createdAt: response.data.CreatedOn
      };

      return assignment;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch assignment");
      return null;
    }
  },

  async getByCourseId(courseId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI field names
      const assignments = response.data?.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id ? assignment.course_id_c.Id.toString() : courseId.toString(),
        title: assignment.title_c || "",
        description: assignment.description_c || "",
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c || "medium",
        completed: assignment.completed_c || false,
        grade: assignment.grade_c,
        weight: assignment.weight_c || 1,
        type: assignment.type_c || "Assignment",
        createdAt: assignment.CreatedOn
      })) || [];

      return assignments;
    } catch (error) {
      console.error("Error fetching course assignments:", error?.response?.data?.message || error);
      toast.error("Failed to fetch course assignments");
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const apperClient = getApperClient();
      
      // Transform UI field names to database field names (only Updateable fields)
      const dbAssignmentData = {
        Name: assignmentData.title || "",
        course_id_c: parseInt(assignmentData.courseId),
        title_c: assignmentData.title || "",
        description_c: assignmentData.description || "",
        due_date_c: assignmentData.dueDate,
        priority_c: assignmentData.priority || "medium",
        completed_c: assignmentData.completed || false,
        grade_c: assignmentData.grade || null,
        weight_c: parseFloat(assignmentData.weight) || 1,
        type_c: assignmentData.type || "Assignment"
      };

      const params = {
        records: [dbAssignmentData]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} assignments:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdAssignment = successful[0].data;
          // Transform back to UI format
          return {
            Id: createdAssignment.Id,
            courseId: createdAssignment.course_id_c?.Id ? createdAssignment.course_id_c.Id.toString() : assignmentData.courseId.toString(),
            title: createdAssignment.title_c || "",
            description: createdAssignment.description_c || "",
            dueDate: createdAssignment.due_date_c,
            priority: createdAssignment.priority_c || "medium",
            completed: createdAssignment.completed_c || false,
            grade: createdAssignment.grade_c,
            weight: createdAssignment.weight_c || 1,
            type: createdAssignment.type_c || "Assignment",
            createdAt: createdAssignment.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to create assignment");
      return null;
    }
  },

  async update(id, assignmentData) {
    try {
      const apperClient = getApperClient();
      
      // Transform UI field names to database field names (only Updateable fields)
      const dbAssignmentData = {
        Id: parseInt(id),
        Name: assignmentData.title || "",
        course_id_c: parseInt(assignmentData.courseId),
        title_c: assignmentData.title || "",
        description_c: assignmentData.description || "",
        due_date_c: assignmentData.dueDate,
        priority_c: assignmentData.priority || "medium",
        completed_c: assignmentData.completed || false,
        grade_c: assignmentData.grade || null,
        weight_c: parseFloat(assignmentData.weight) || 1,
        type_c: assignmentData.type || "Assignment"
      };

      const params = {
        records: [dbAssignmentData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedAssignment = successful[0].data;
          // Transform back to UI format
          return {
            Id: updatedAssignment.Id,
            courseId: updatedAssignment.course_id_c?.Id ? updatedAssignment.course_id_c.Id.toString() : assignmentData.courseId.toString(),
            title: updatedAssignment.title_c || "",
            description: updatedAssignment.description_c || "",
            dueDate: updatedAssignment.due_date_c,
            priority: updatedAssignment.priority_c || "medium",
            completed: updatedAssignment.completed_c || false,
            grade: updatedAssignment.grade_c,
            weight: updatedAssignment.weight_c || 1,
            type: updatedAssignment.type_c || "Assignment",
            createdAt: updatedAssignment.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to update assignment");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} assignments:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      toast.error("Failed to delete assignment");
      return false;
    }
  },

  async toggleComplete(id, completed) {
    try {
      const apperClient = getApperClient();
      
      const dbAssignmentData = {
        Id: parseInt(id),
        completed_c: completed
      };

      const params = {
        records: [dbAssignmentData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to toggle ${failed.length} assignments:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedAssignment = successful[0].data;
          // Transform back to UI format
          return {
            Id: updatedAssignment.Id,
            courseId: updatedAssignment.course_id_c?.Id ? updatedAssignment.course_id_c.Id.toString() : "",
            title: updatedAssignment.title_c || "",
            description: updatedAssignment.description_c || "",
            dueDate: updatedAssignment.due_date_c,
            priority: updatedAssignment.priority_c || "medium",
            completed: updatedAssignment.completed_c || false,
            grade: updatedAssignment.grade_c,
            weight: updatedAssignment.weight_c || 1,
            type: updatedAssignment.type_c || "Assignment",
            createdAt: updatedAssignment.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error toggling assignment completion:", error?.response?.data?.message || error);
      toast.error("Failed to toggle assignment completion");
      return null;
    }
  }
};