import { toast } from "react-toastify";

const assignmentService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Due_Date_c"}},
          {"field": {"Name": "Points_c"}},
          {"field": {"Name": "Class_c"}},
          {"field": {"Name": "Attachments_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords("assignment_c", params);

      if (!response.success) {
        console.error("Failed to fetch assignments:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error.message);
      toast.error("Failed to load assignments. Please try again.");
      return [];
    }
  },

  async getById(Id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Due_Date_c"}},
          {"field": {"Name": "Points_c"}},
          {"field": {"Name": "Class_c"}},
          {"field": {"Name": "Attachments_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await apperClient.getRecordById("assignment_c", Id, params);

      if (!response.success || !response.data) {
        console.error("Assignment not found:", response.message);
        toast.error("Assignment not found");
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching assignment:", error?.response?.data?.message || error.message);
      toast.error("Failed to load assignment details. Please try again.");
      return null;
    }
  },

  async getByClassId(classId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Due_Date_c"}},
          {"field": {"Name": "Points_c"}},
          {"field": {"Name": "Class_c"}},
          {"field": {"Name": "Attachments_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        where: [{"FieldName": "Class_c", "Operator": "EqualTo", "Values": [parseInt(classId)]}],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords("assignment_c", params);

      if (!response.success) {
        console.error("Failed to fetch assignments for class:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments for class:", error?.response?.data?.message || error.message);
      toast.error("Failed to load class assignments. Please try again.");
      return [];
    }
  },

  async create(data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Title_c: data.title || data.Title_c,
          Description_c: data.description || data.Description_c,
          Due_Date_c: data.dueDate || data.Due_Date_c,
          Points_c: parseInt(data.points || data.Points_c || 0),
          Class_c: parseInt(data.classId || data.Class_c),
          Attachments_c: data.attachments || data.Attachments_c || ""
        }]
      };

      const response = await apperClient.createRecord("assignment_c", params);

      if (!response.success) {
        console.error("Failed to create assignment:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create assignment: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success("Assignment created successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error.message);
      toast.error("Failed to create assignment. Please try again.");
      return null;
    }
  },

  async update(Id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: Id
      };

      if (data.title || data.Title_c) updateData.Title_c = data.title || data.Title_c;
      if (data.description || data.Description_c) updateData.Description_c = data.description || data.Description_c;
      if (data.dueDate || data.Due_Date_c) updateData.Due_Date_c = data.dueDate || data.Due_Date_c;
      if (data.points || data.Points_c) updateData.Points_c = parseInt(data.points || data.Points_c);
      if (data.classId || data.Class_c) updateData.Class_c = parseInt(data.classId || data.Class_c);
      if (data.attachments || data.Attachments_c) updateData.Attachments_c = data.attachments || data.Attachments_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("assignment_c", params);

      if (!response.success) {
        console.error("Failed to update assignment:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update assignment: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success("Assignment updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error.message);
      toast.error("Failed to update assignment. Please try again.");
      return null;
    }
  },

  async delete(Id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [Id]
      };

      const response = await apperClient.deleteRecord("assignment_c", params);

      if (!response.success) {
        console.error("Failed to delete assignment:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete assignment: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        toast.success("Assignment deleted successfully!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete assignment. Please try again.");
      return false;
    }
  }
};

export default assignmentService;