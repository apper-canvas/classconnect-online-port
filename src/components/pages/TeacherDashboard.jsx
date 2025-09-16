import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import classService from "@/services/api/classService";
import assignmentService from "@/services/api/assignmentService";

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [classesData, assignmentsData] = await Promise.all([
        classService.getAll(),
        assignmentService.getAll()
      ]);
      
      setClasses(classesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

const totalStudents = classes.length * 25; // Placeholder for student count
  const recentAssignments = assignments.slice(0, 3);
  const recentClasses = classes.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Teacher Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening in your classes.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button 
            variant="secondary" 
            onClick={() => navigate("/announcements")}
            leftIcon="Megaphone"
          >
            Post Announcement
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate("/classes")}
            leftIcon="Plus"
          >
            Create Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Classes"
          value={classes.length}
          change="+2 this month"
          changeType="increase"
          icon="GraduationCap"
          color="primary"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          change="+12 this week"
          changeType="increase"
          icon="Users"
          color="success"
        />
        <StatCard
          title="Assignments"
          value={assignments.length}
          change="+5 this week"
          changeType="increase"
          icon="FileText"
          color="warning"
        />
        <StatCard
          title="Avg. Grade"
          value="87%"
          change="+3% this month"
          changeType="increase"
          icon="Trophy"
          color="info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Classes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Classes</h3>
              <p className="text-sm text-slate-600">Your most recently created classes</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/classes")}
              rightIcon="ArrowRight"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentClasses.map((classItem) => (
<div key={classItem.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate(`/classes/${classItem.Id}`)}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                    <ApperIcon name="GraduationCap" className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
<h4 className="font-semibold text-slate-900">{classItem.Name_c}</h4>
                    <p className="text-sm text-slate-600">{classItem.Description_c}</p>
                  </div>
                </div>
                <div className="text-right">
<p className="text-sm text-slate-500">{format(new Date(classItem.CreatedDate), "MMM d")}</p>
                  <p className="text-xs text-slate-400 font-mono">{classItem.Class_Code_c}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Assignments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Assignments</h3>
              <p className="text-sm text-slate-600">Latest assignments you've created</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/assignments")}
              rightIcon="ArrowRight"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentAssignments.map((assignment) => (
<div key={assignment.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate(`/assignments/${assignment.Id}`)}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl">
                    <ApperIcon name="FileText" className="h-5 w-5 text-accent-600" />
                  </div>
                  <div>
<h4 className="font-semibold text-slate-900">{assignment.Title_c}</h4>
                    <p className="text-sm text-slate-600">{assignment.Points_c} points</p>
                  </div>
                </div>
                <div className="text-right">
<p className="text-sm text-slate-500">Due {format(new Date(assignment.Due_Date_c), "MMM d")}</p>
                  <p className="text-xs text-slate-400">0 submissions</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="secondary" 
            size="lg" 
            className="flex-col h-20 space-y-2"
            onClick={() => navigate("/classes")}
          >
            <ApperIcon name="Plus" className="h-6 w-6" />
            <span>Create Class</span>
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="flex-col h-20 space-y-2"
            onClick={() => navigate("/assignments")}
          >
            <ApperIcon name="FileText" className="h-6 w-6" />
            <span>New Assignment</span>
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="flex-col h-20 space-y-2"
            onClick={() => navigate("/gradebook")}
          >
            <ApperIcon name="Trophy" className="h-6 w-6" />
            <span>View Grades</span>
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="flex-col h-20 space-y-2"
            onClick={() => navigate("/announcements")}
          >
            <ApperIcon name="Megaphone" className="h-6 w-6" />
            <span>Announcements</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TeacherDashboard;