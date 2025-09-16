import { toast } from "react-toastify";

const classService = {
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
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Class_Code_c"}},
          {"field": {"Name": "Teacher_Id_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords("class_c", params);

      if (!response.success) {
        console.error("Failed to fetch classes:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error.message);
      toast.error("Failed to load classes. Please try again.");
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
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Class_Code_c"}},
          {"field": {"Name": "Teacher_Id_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await apperClient.getRecordById("class_c", Id, params);

      if (!response.success || !response.data) {
        console.error("Class not found:", response.message);
        toast.error("Class not found");
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching class:", error?.response?.data?.message || error.message);
      toast.error("Failed to load class details. Please try again.");
      return null;
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
          Name_c: data.name || data.Name_c,
          Description_c: data.description || data.Description_c,
          Class_Code_c: data.classCode || data.Class_Code_c || Math.random().toString(36).substring(2, 8).toUpperCase(),
          Teacher_Id_c: data.teacherId || data.Teacher_Id_c
        }]
      };

      const response = await apperClient.createRecord("class_c", params);

      if (!response.success) {
        console.error("Failed to create class:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create class: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success("Class created successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error.message);
      toast.error("Failed to create class. Please try again.");
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

      if (data.name || data.Name_c) updateData.Name_c = data.name || data.Name_c;
      if (data.description || data.Description_c) updateData.Description_c = data.description || data.Description_c;
      if (data.classCode || data.Class_Code_c) updateData.Class_Code_c = data.classCode || data.Class_Code_c;
      if (data.teacherId || data.Teacher_Id_c) updateData.Teacher_Id_c = data.teacherId || data.Teacher_Id_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("class_c", params);

      if (!response.success) {
        console.error("Failed to update class:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update class: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success("Class updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error.message);
      toast.error("Failed to update class. Please try again.");
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

      const response = await apperClient.deleteRecord("class_c", params);

      if (!response.success) {
        console.error("Failed to delete class:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete class: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        toast.success("Class deleted successfully!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete class. Please try again.");
      return false;
    }
  }
};

export default classService;