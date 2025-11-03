import { toast } from "react-toastify";
import React from "react";

const tableName = 'course_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}}, 
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI field names for compatibility
      const courses = response.data?.map(course => ({
        Id: course.Id,
        name: course.name_c || "",
        instructor: course.instructor_c || "",
        color: course.color_c || "#4F46E5",
        credits: course.credits_c || 3,
        semester: course.semester_c || "Fall 2024",
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
        createdAt: course.CreatedOn
      })) || [];

      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      toast.error("Failed to fetch courses");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}}, 
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "schedule_c"}},
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
        toast.error("Course not found");
        return null;
      }

      // Transform database fields to UI field names
      const course = {
        Id: response.data.Id,
        name: response.data.name_c || "",
        instructor: response.data.instructor_c || "",
        color: response.data.color_c || "#4F46E5",
        credits: response.data.credits_c || 3,
        semester: response.data.semester_c || "Fall 2024",
        schedule: response.data.schedule_c ? JSON.parse(response.data.schedule_c) : [],
        createdAt: response.data.CreatedOn
      };

      return course;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch course");
      return null;
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient();
      
      // Transform UI field names to database field names (only Updateable fields)
      const dbCourseData = {
        Name: courseData.name || "",
        name_c: courseData.name || "",
        instructor_c: courseData.instructor || "",
        color_c: courseData.color || "#4F46E5", 
        credits_c: parseInt(courseData.credits) || 3,
        semester_c: courseData.semester || "Fall 2024",
        schedule_c: JSON.stringify(courseData.schedule || [])
      };

      const params = {
        records: [dbCourseData]
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
          console.error(`Failed to create ${failed.length} courses:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdCourse = successful[0].data;
          // Transform back to UI format
          return {
            Id: createdCourse.Id,
            name: createdCourse.name_c || "",
            instructor: createdCourse.instructor_c || "",
            color: createdCourse.color_c || "#4F46E5",
            credits: createdCourse.credits_c || 3,
            semester: createdCourse.semester_c || "Fall 2024",
            schedule: createdCourse.schedule_c ? JSON.parse(createdCourse.schedule_c) : [],
            createdAt: createdCourse.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      toast.error("Failed to create course");
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = getApperClient();
      
      // Transform UI field names to database field names (only Updateable fields)
      const dbCourseData = {
        Id: parseInt(id),
        Name: courseData.name || "",
        name_c: courseData.name || "",
        instructor_c: courseData.instructor || "",
        color_c: courseData.color || "#4F46E5",
        credits_c: parseInt(courseData.credits) || 3,
        semester_c: courseData.semester || "Fall 2024",
        schedule_c: JSON.stringify(courseData.schedule || [])
      };

      const params = {
        records: [dbCourseData]
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
          console.error(`Failed to update ${failed.length} courses:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedCourse = successful[0].data;
          // Transform back to UI format
          return {
            Id: updatedCourse.Id,
            name: updatedCourse.name_c || "",
            instructor: updatedCourse.instructor_c || "",
            color: updatedCourse.color_c || "#4F46E5",
            credits: updatedCourse.credits_c || 3,
            semester: updatedCourse.semester_c || "Fall 2024",
            schedule: updatedCourse.schedule_c ? JSON.parse(updatedCourse.schedule_c) : [],
            createdAt: updatedCourse.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      toast.error("Failed to update course");
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
          console.error(`Failed to delete ${failed.length} courses:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      toast.error("Failed to delete course");
return false;
    }
  }
};