import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { format, isAfter, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import classService from "@/services/api/classService";
import assignmentService from "@/services/api/assignmentService";

const StudentDashboard = () => {
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
      
      // Filter to show only first 3 classes for student view
      setClasses(classesData.slice(0, 3));
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

const upcomingAssignments = assignments.filter(assignment => {
    const dueDate = new Date(assignment.Due_Date_c);
    const now = new Date();
    return isAfter(dueDate, now) && differenceInDays(dueDate, now) <= 7;
  }).slice(0, 4);

  const completedAssignments = Math.floor(assignments.length * 0.7); // Mock completed assignments
  const avgGrade = 87; // Mock average grade

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Student Dashboard</h1>
          <p className="text-slate-600 mt-1">Keep track of your classes, assignments, and grades.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button 
            variant="secondary" 
            onClick={() => navigate("/assignments")}
            leftIcon="FileText"
          >
            View Assignments
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate("/classes")}
            leftIcon="Plus"
          >
            Join Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Classes"
          value={classes.length}
          change="+1 this month"
          changeType="increase"
          icon="GraduationCap"
          color="primary"
        />
        <StatCard
          title="Assignments Due"
          value={upcomingAssignments.length}
          change="-2 this week"
          changeType="decrease"
          icon="Clock"
          color="warning"
        />
        <StatCard
          title="Completed"
          value={completedAssignments}
          change="+5 this week"
          changeType="increase"
          icon="CheckCircle"
          color="success"
        />
        <StatCard
          title="Average Grade"
          value={`${avgGrade}%`}
          change="+2% this month"
          changeType="increase"
          icon="Trophy"
          color="info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Classes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">My Classes</h3>
              <p className="text-sm text-slate-600">Classes you're currently enrolled in</p>
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
{classes.map((classItem) => (
              <div key={classItem.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate(`/classes/${classItem.Id}`)}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                    <ApperIcon name="GraduationCap" className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
<h4 className="font-semibold text-slate-900">{classItem.Name_c}</h4>
                    <p className="text-sm text-slate-600">Class Code: {classItem.Class_Code_c}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="primary" size="sm">Active</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Upcoming Assignments</h3>
              <p className="text-sm text-slate-600">Assignments due in the next 7 days</p>
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
            {upcomingAssignments.map((assignment) => {
const dueDate = new Date(assignment.Due_Date_c);
              const daysUntilDue = differenceInDays(dueDate, new Date());
              
              return (
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
                    <p className="text-sm text-slate-500">Due {format(dueDate, "MMM d")}</p>
                    <Badge 
                      variant={daysUntilDue <= 1 ? "error" : daysUntilDue <= 3 ? "warning" : "success"} 
                      size="sm"
                    >
                      {daysUntilDue === 0 ? "Due Today" : `${daysUntilDue} days`}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-success-50 to-green-50 rounded-xl">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-success-100 to-success-200 rounded-xl">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-success-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">Assignment submitted</h4>
              <p className="text-sm text-slate-600">You submitted "Math Homework #5" on time</p>
            </div>
            <p className="text-sm text-slate-500">2 hours ago</p>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <ApperIcon name="Star" className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">Grade received</h4>
              <p className="text-sm text-slate-600">You received 92% on "Science Lab Report"</p>
            </div>
            <p className="text-sm text-slate-500">1 day ago</p>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
              <ApperIcon name="Users" className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">Joined new class</h4>
              <p className="text-sm text-slate-600">You joined "Advanced Chemistry" class</p>
            </div>
            <p className="text-sm text-slate-500">3 days ago</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;