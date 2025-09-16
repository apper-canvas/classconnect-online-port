import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";
import classService from "@/services/api/classService";
import assignmentService from "@/services/api/assignmentService";

const ClassDetail = ({ userRole }) => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const loadClassData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [classInfo, classAssignments] = await Promise.all([
        classService.getById(parseInt(classId)),
        assignmentService.getByClassId(parseInt(classId))
      ]);
      
      setClassData(classInfo);
      setAssignments(classAssignments);
    } catch (err) {
      setError("Failed to load class details. Please try again.");
      console.error("Class detail loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      loadClassData();
    }
  }, [classId]);

  const handleCopyClassCode = () => {
navigator.clipboard.writeText(classData.Class_Code_c);
    toast.success("Class code copied to clipboard!");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClassData} />;
  }

  if (!classData) {
    return <Error message="Class not found." />;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "BarChart3" },
    { id: "assignments", label: "Assignments", icon: "FileText" },
    { id: "students", label: "Students", icon: "Users" },
    { id: "announcements", label: "Announcements", icon: "Megaphone" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/classes")}
            leftIcon="ArrowLeft"
          >
            Back to Classes
          </Button>
        </div>
      </div>

      {/* Class Header */}
      <Card className="p-6" gradient>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start space-x-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl">
              <ApperIcon name="GraduationCap" className="h-8 w-8 text-primary-600" />
            </div>
            <div>
<h1 className="text-3xl font-bold gradient-text mb-2">{classData.Name_c}</h1>
              <p className="text-slate-600 text-lg mb-4">{classData.Description_c}</p>
              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <ApperIcon name="Users" className="h-4 w-4 mr-2" />
<span>Active Class</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                  <span>Created {format(new Date(classData.CreatedDate), "MMM d, yyyy")}</span>
                </div>
{classData.Class_Code_c && (
                <div className="flex items-center">
                  <ApperIcon name="Key" className="h-4 w-4 mr-2" />
                  <span className="font-mono">{classData.Class_Code_c}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyClassCode}
                      className="ml-2"
                    >
                      <ApperIcon name="Copy" className="h-3 w-3" />
                    </Button>
                </div>
                )}
              </div>
            </div>
          </div>
          
          {userRole === "teacher" && (
            <div className="mt-6 lg:mt-0 flex space-x-3">
              <Button variant="secondary" leftIcon="Settings">
                Settings
              </Button>
              <Button 
                variant="primary" 
                leftIcon="Plus"
                onClick={() => navigate("/assignments")}
              >
                New Assignment
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success-100 to-success-200 rounded-lg">
                      <ApperIcon name="FileText" className="h-4 w-4 text-success-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Assignment posted</p>
                      <p className="text-xs text-slate-600">Math Homework #5 was assigned</p>
                    </div>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                      <ApperIcon name="UserPlus" className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">New student joined</p>
                      <p className="text-xs text-slate-600">Emma Wilson joined the class</p>
                    </div>
                    <p className="text-xs text-slate-500">1 day ago</p>
                  </div>
                </div>
              </Card>

              {/* Upcoming Assignments */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Assignments</h3>
                {assignments.length === 0 ? (
                  <Empty type="assignments" />
                ) : (
                  <div className="space-y-3">
                    {assignments.slice(0, 3).map((assignment) => (
                      <div 
                        key={assignment.Id} 
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200"
                        onClick={() => navigate(`/assignments/${assignment.Id}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg">
                            <ApperIcon name="FileText" className="h-4 w-4 text-accent-600" />
                          </div>
                          <div>
<p className="font-medium text-slate-900">{assignment.Title_c}</p>
                            <p className="text-sm text-slate-600">{assignment.Points_c} points</p>
                          </div>
                        </div>
                        <div className="text-right">
<p className="text-sm text-slate-500">Due {format(new Date(assignment.Due_Date_c), "MMM d")}</p>
                          <Badge variant="warning" size="sm">Pending</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Class Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Total Students</span>
<span className="font-bold text-primary-600">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Active Assignments</span>
                    <span className="font-bold text-accent-600">{assignments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Average Grade</span>
                    <span className="font-bold text-success-600">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Completion Rate</span>
                    <span className="font-bold text-blue-600">94%</span>
                  </div>
                </div>
              </Card>

              {userRole === "teacher" && (
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Class Code</h3>
                  <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-200">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-2">Share this code with students</p>
<p className="text-2xl font-mono font-bold text-primary-600 mb-4">{classData.Class_Code_c}</p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleCopyClassCode}
                        leftIcon="Copy"
                        className="w-full"
                      >
                        Copy Code
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === "assignments" && (
          <div>
            {assignments.length === 0 ? (
              <Empty type="assignments" onAction={() => navigate("/assignments")} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                  <Card key={assignment.Id} className="p-6 cursor-pointer card-hover" onClick={() => navigate(`/assignments/${assignment.Id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
<h3 className="text-lg font-bold text-slate-900 mb-1">{assignment.Title_c}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2">{assignment.Description_c}</p>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl ml-4">
                        <ApperIcon name="FileText" className="h-5 w-5 text-accent-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-500">
                        <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
<span>Due {format(new Date(assignment.Due_Date_c), "MMM d")}</span>
                      </div>
                      <div className="flex items-center text-slate-500">
                        <ApperIcon name="Star" className="h-4 w-4 mr-1" />
                        <span>{assignment.points} pts</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
<h3 className="text-lg font-bold text-slate-900">Students (0)</h3>
              {userRole === "teacher" && (
                <Button variant="secondary" leftIcon="UserPlus">
                  Invite Students
                </Button>
              )}
            </div>
            
            {(!classData.students || classData.students.length === 0) ? (
              <Empty type="students" />
            ) : (
              <div className="space-y-3">
{[].map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full">
                        <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{student.name || `Student ${index + 1}`}</p>
                        <p className="text-sm text-slate-600">{student.email || `student${index + 1}@example.com`}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === "announcements" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Announcements</h3>
              {userRole === "teacher" && (
                <Button variant="primary" leftIcon="Plus">
                  New Announcement
                </Button>
              )}
            </div>
            
            <Empty type="announcements" />
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClassDetail;