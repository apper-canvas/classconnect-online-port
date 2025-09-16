import classData from "@/services/mockData/classes.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate class code
const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const classService = {
  async getAll() {
    await delay(300);
    return [...classData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(Id) {
    await delay(200);
    const cls = classData.find(c => c.Id === Id);
    if (!cls) {
      throw new Error("Class not found");
    }
    return { ...cls };
  },

  async create(data) {
    await delay(500);
    const maxId = Math.max(...classData.map(c => c.Id), 0);
    const newClass = {
      Id: maxId + 1,
      ...data,
      classCode: data.classCode || generateClassCode(),
      students: data.students || [],
      createdAt: new Date().toISOString()
    };
    classData.push(newClass);
    return { ...newClass };
  },

  async update(Id, data) {
    await delay(400);
    const index = classData.findIndex(c => c.Id === Id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    classData[index] = { ...classData[index], ...data };
    return { ...classData[index] };
  },

  async delete(Id) {
    await delay(300);
    const index = classData.findIndex(c => c.Id === Id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    classData.splice(index, 1);
    return { success: true };
  }
};

export default classService;