import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import assignmentService from "@/services/api/assignmentService";
import classService from "@/services/api/classService";

const Assignments = ({ userRole }) => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
const [formData, setFormData] = useState({
    Title_c: "",
    Description_c: "",
    Due_Date_c: "",
    Points_c: "",
    Class_c: ""
  });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, classesData] = await Promise.all([
        assignmentService.getAll(),
        classService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setFilteredAssignments(assignmentsData);
      setClasses(classesData);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
      console.error("Assignments loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredAssignments(assignments);
    } else {
const filtered = assignments.filter(assignment =>
        assignment.Title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.Description_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAssignments(filtered);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate || !formData.points || !formData.classId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setCreating(true);
const newAssignment = await assignmentService.create({
        Title_c: formData.Title_c,
        Description_c: formData.Description_c,
        Due_Date_c: formData.Due_Date_c,
        Points_c: parseInt(formData.Points_c),
        Class_c: parseInt(formData.Class_c),
        Attachments_c: ""
      });
      
      const updatedAssignments = [newAssignment, ...assignments];
      setAssignments(updatedAssignments);
      setFilteredAssignments(updatedAssignments);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        points: "",
        classId: ""
      });
      toast.success("Assignment created successfully!");
    } catch (err) {
      toast.error("Failed to create assignment. Please try again.");
      console.error("Assignment creation error:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {userRole === "teacher" ? "Assignments" : "My Assignments"}
          </h1>
          <p className="text-slate-600 mt-1">
            {userRole === "teacher" 
              ? "Create and manage assignments for your classes."
              : "View and submit your assignments."
            }
          </p>
        </div>
        {userRole === "teacher" && (
          <div className="mt-4 sm:mt-0">
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
              leftIcon="Plus"
            >
              Create Assignment
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar 
            placeholder="Search assignments..." 
            onSearch={handleSearch}
            className="sm:max-w-md"
          />
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Due Soon</option>
              <option>Overdue</option>
              <option>Completed</option>
            </select>
            <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
              <option>All Classes</option>
              {classes.map(cls => (
<option key={cls.Id} value={cls.Id}>{cls.Name_c}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
        <Empty
          type="assignments"
          onAction={userRole === "teacher" ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard 
              key={assignment.Id} 
              assignment={assignment} 
              userRole={userRole}
            />
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Create New Assignment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAssignment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Assignment Title"
                  name="title"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  type="select"
                  label="Class"
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
options={classes.map(cls => ({ value: cls.Id.toString(), label: cls.Name_c }))}
                  required
                />
              </div>
              
              <FormField
                type="textarea"
                label="Description"
                name="description"
                placeholder="Enter assignment description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="date"
                  label="Due Date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  type="number"
                  label="Points"
                  name="points"
                  placeholder="Enter total points"
                  value={formData.points}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Assignment Instructions</p>
                    <p className="text-sm text-blue-700">Students will be able to submit their work and receive feedback once you create this assignment.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={creating}
                  className="flex-1"
                >
                  Create Assignment
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Assignments;