import announcementData from "@/services/mockData/announcements.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const announcementService = {
  async getAll() {
    await delay(250);
    return [...announcementData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(Id) {
    await delay(200);
    const announcement = announcementData.find(a => a.Id === Id);
    if (!announcement) {
      throw new Error("Announcement not found");
    }
    return { ...announcement };
  },

  async getByClassId(classId) {
    await delay(300);
    return announcementData.filter(a => a.classId === classId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(data) {
    await delay(500);
    const maxId = Math.max(...announcementData.map(a => a.Id), 0);
    const newAnnouncement = {
      Id: maxId + 1,
      ...data,
      createdAt: new Date().toISOString()
    };
    announcementData.push(newAnnouncement);
    return { ...newAnnouncement };
  },

  async update(Id, data) {
    await delay(400);
    const index = announcementData.findIndex(a => a.Id === Id);
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    announcementData[index] = { ...announcementData[index], ...data };
    return { ...announcementData[index] };
  },

  async delete(Id) {
    await delay(300);
    const index = announcementData.findIndex(a => a.Id === Id);
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    announcementData.splice(index, 1);
    return { success: true };
  }
};

export default announcementService;