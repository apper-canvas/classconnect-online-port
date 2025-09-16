import assignmentData from "@/services/mockData/assignments.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const assignmentService = {
  async getAll() {
    await delay(350);
    return [...assignmentData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(Id) {
    await delay(250);
    const assignment = assignmentData.find(a => a.Id === Id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async getByClassId(classId) {
    await delay(300);
    return assignmentData.filter(a => a.classId === classId);
  },

  async create(data) {
    await delay(600);
    const maxId = Math.max(...assignmentData.map(a => a.Id), 0);
    const newAssignment = {
      Id: maxId + 1,
      ...data,
      attachments: data.attachments || [],
      createdAt: new Date().toISOString()
    };
    assignmentData.push(newAssignment);
    return { ...newAssignment };
  },

  async update(Id, data) {
    await delay(450);
    const index = assignmentData.findIndex(a => a.Id === Id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignmentData[index] = { ...assignmentData[index], ...data };
    return { ...assignmentData[index] };
  },

  async delete(Id) {
    await delay(350);
    const index = assignmentData.findIndex(a => a.Id === Id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignmentData.splice(index, 1);
    return { success: true };
  }
};

export default assignmentService;