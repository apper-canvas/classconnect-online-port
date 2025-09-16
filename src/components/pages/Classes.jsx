import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ClassCard from "@/components/molecules/ClassCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import classService from "@/services/api/classService";

const Classes = ({ userRole }) => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
const [formData, setFormData] = useState({
    Name_c: "",
    Description_c: "",
    Class_Code_c: ""
  });
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await classService.getAll();
      setClasses(data);
      setFilteredClasses(data);
    } catch (err) {
      setError("Failed to load classes. Please try again.");
      console.error("Classes loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredClasses(classes);
    } else {
      const filtered = classes.filter(cls =>
cls.Name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.Description_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  };

const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!formData.Name_c.trim() || !formData.Description_c.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setCreating(true);
      const newClass = await classService.create({
        Name_c: formData.Name_c,
        Description_c: formData.Description_c,
        Teacher_Id_c: 1, // Placeholder teacher ID
        Class_Code_c: Math.random().toString(36).substring(2, 8).toUpperCase()
      });
      
      if (newClass) {
        const updatedClasses = [newClass, ...classes];
        setClasses(updatedClasses);
        setFilteredClasses(updatedClasses);
        setShowCreateModal(false);
        setFormData({ Name_c: "", Description_c: "", Class_Code_c: "" });
      }
    } catch (err) {
      console.error("Class creation error:", err);
    } finally {
      setCreating(false);
    }
  };

const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!formData.Class_Code_c.trim()) {
      toast.error("Please enter a class code.");
      return;
    }

    try {
      setJoining(true);
      // Simulate joining a class
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowJoinModal(false);
      setFormData({ Name_c: "", Description_c: "", Class_Code_c: "" });
      toast.success("Successfully joined the class!");
      await loadClasses(); // Reload classes
    } catch (err) {
      toast.error("Failed to join class. Please check the class code.");
      console.error("Class joining error:", err);
    } finally {
      setJoining(false);
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
    return <Error message={error} onRetry={loadClasses} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {userRole === "teacher" ? "My Classes" : "Enrolled Classes"}
          </h1>
          <p className="text-slate-600 mt-1">
            {userRole === "teacher" 
              ? "Manage your classes and track student progress."
              : "Access your enrolled classes and course materials."
            }
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {userRole === "teacher" ? (
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
              leftIcon="Plus"
            >
              Create Class
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={() => setShowJoinModal(true)}
              leftIcon="UserPlus"
            >
              Join Class
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar 
            placeholder="Search classes..." 
            onSearch={handleSearch}
            className="sm:max-w-md"
          />
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
              <option>All Classes</option>
              <option>Active</option>
              <option>Archived</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <Empty
          type="classes"
          onAction={userRole === "teacher" ? () => setShowCreateModal(true) : () => setShowJoinModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <ClassCard 
key={classItem.Id} 
              classData={classItem}
            />
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Create New Class</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateClass} className="space-y-4">
              <FormField
                label="Class Name"
                name="name"
                placeholder="Enter class name"
value={formData.Name_c}
                onChange={(e) => setFormData({...formData, Name_c: e.target.value})}
                required
              />
              <FormField
                type="textarea"
label="Description"
                name="Description_c"
                value={formData.Description_c}
                onChange={(e) => setFormData({...formData, Description_c: e.target.value})}
                placeholder="Enter class description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
              />
              
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
                  Create Class
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Join Class</h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleJoinClass} className="space-y-4">
              <FormField
                label="Class Code"
                name="classCode"
                placeholder="Enter 6-digit class code"
value={formData.Class_Code_c}
                onChange={(e) => setFormData({...formData, Class_Code_c: e.target.value})}
                leftIcon={<ApperIcon name="Key" className="h-4 w-4" />}
                required
              />
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Need a class code?</p>
                    <p className="text-sm text-blue-700">Ask your teacher for the 6-digit class code to join their class.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={joining}
                  className="flex-1"
                >
                  Join Class
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Classes;