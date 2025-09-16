import { toast } from "react-toastify";

const announcementService = {
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
          {"field": {"Name": "Content_c"}},
          {"field": {"Name": "Class_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords("announcement_c", params);

      if (!response.success) {
        console.error("Failed to fetch announcements:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching announcements:", error?.response?.data?.message || error.message);
      toast.error("Failed to load announcements. Please try again.");
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
          {"field": {"Name": "Content_c"}},
          {"field": {"Name": "Class_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await apperClient.getRecordById("announcement_c", Id, params);

      if (!response.success || !response.data) {
        console.error("Announcement not found:", response.message);
        toast.error("Announcement not found");
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching announcement:", error?.response?.data?.message || error.message);
      toast.error("Failed to load announcement details. Please try again.");
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
          {"field": {"Name": "Content_c"}},
          {"field": {"Name": "Class_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        where: [{"FieldName": "Class_c", "Operator": "EqualTo", "Values": [parseInt(classId)]}],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords("announcement_c", params);

      if (!response.success) {
        console.error("Failed to fetch announcements for class:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching announcements for class:", error?.response?.data?.message || error.message);
      toast.error("Failed to load class announcements. Please try again.");
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
          Content_c: data.content || data.Content_c,
          Class_c: parseInt(data.classId || data.Class_c)
        }]
      };

      const response = await apperClient.createRecord("announcement_c", params);

      if (!response.success) {
        console.error("Failed to create announcement:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create announcement: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success("Announcement created successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating announcement:", error?.response?.data?.message || error.message);
      toast.error("Failed to create announcement. Please try again.");
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
      if (data.content || data.Content_c) updateData.Content_c = data.content || data.Content_c;
      if (data.classId || data.Class_c) updateData.Class_c = parseInt(data.classId || data.Class_c);

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("announcement_c", params);

      if (!response.success) {
        console.error("Failed to update announcement:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update announcement: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success("Announcement updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating announcement:", error?.response?.data?.message || error.message);
      toast.error("Failed to update announcement. Please try again.");
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

      const response = await apperClient.deleteRecord("announcement_c", params);

      if (!response.success) {
        console.error("Failed to delete announcement:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete announcement: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        toast.success("Announcement deleted successfully!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting announcement:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete announcement. Please try again.");
      return false;
    }
  }
};

export default announcementService;