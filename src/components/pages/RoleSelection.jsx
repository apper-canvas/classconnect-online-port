import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const RoleSelection = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setLoading(true);

    try {
// Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        Id: 1,
        firstName: role === "teacher" ? "Dr. Sarah" : "Alex",
        lastName: role === "teacher" ? "Johnson" : "Thompson",
        emailAddress: role === "teacher" ? "sarah.johnson@school.edu" : "alex.thompson@student.edu",
        role: role
      };

      onRoleSelect(role, mockUser);
      toast.success(`Welcome, ${mockUser.firstName} ${mockUser.lastName}!`);
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl mx-auto mb-6 shadow-xl">
            <ApperIcon name="GraduationCap" className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Welcome to ClassConnect
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive education management platform for seamless classroom collaboration
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card 
            className="p-8 cursor-pointer transition-all duration-300 hover:scale-105 group border-2"
            onClick={() => !loading && handleRoleSelect("teacher")}
            gradient
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mx-auto mb-6 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
                <ApperIcon name="UserCheck" className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">I'm a Teacher</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Create and manage classes, assignments, and track student progress with powerful tools
              </p>
              <div className="space-y-3 text-sm text-slate-500 mb-8">
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-success-500" />
                  <span>Create and manage classes</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-success-500" />
                  <span>Assign and grade work</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-success-500" />
                  <span>Track student progress</span>
                </div>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                loading={loading && selectedRole === "teacher"}
                className="w-full"
                disabled={loading}
              >
                Continue as Teacher
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 cursor-pointer transition-all duration-300 hover:scale-105 group border-2"
            onClick={() => !loading && handleRoleSelect("student")}
            gradient
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl mx-auto mb-6 group-hover:from-success-200 group-hover:to-success-300 transition-all duration-300">
                <ApperIcon name="BookOpen" className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">I'm a Student</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Join classes, submit assignments, and track your academic progress effortlessly
              </p>
              <div className="space-y-3 text-sm text-slate-500 mb-8">
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-success-500" />
                  <span>Join classes with codes</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-success-500" />
                  <span>Submit assignments</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-success-500" />
                  <span>View grades & feedback</span>
                </div>
              </div>
              <Button 
                variant="success" 
                size="lg" 
                loading={loading && selectedRole === "student"}
                className="w-full"
                disabled={loading}
              >
                Continue as Student
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-6">
            Trusted by educators and students worldwide
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mx-auto">
                <ApperIcon name="Shield" className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">Secure Platform</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mx-auto">
                <ApperIcon name="Zap" className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">Lightning Fast</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mx-auto">
                <ApperIcon name="Users" className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">Collaborative</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mx-auto">
                <ApperIcon name="Smartphone" className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">Mobile Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;