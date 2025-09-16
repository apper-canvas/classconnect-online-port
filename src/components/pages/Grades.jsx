import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import assignmentService from "@/services/api/assignmentService";
import classService from "@/services/api/classService";

const Grades = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const navigate = useNavigate();

  const loadGradesData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, classesData] = await Promise.all([
        assignmentService.getAll(),
        classService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setClasses(classesData);
      if (classesData.length > 0) {
        setSelectedClass(classesData[0].Id.toString());
      }
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
      console.error("Grades loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  // Mock grade data for demonstration
  const mockGrades = [
    { assignmentId: 1, grade: 92, feedback: "Excellent work! Great attention to detail.", submitted: true, graded: true },
    { assignmentId: 2, grade: 88, feedback: "Good effort. Consider reviewing the concepts on page 45.", submitted: true, graded: true },
    { assignmentId: 3, grade: 95, feedback: "Outstanding! Your analysis was thorough and well-reasoned.", submitted: true, graded: true },
    { assignmentId: 4, grade: null, feedback: null, submitted: false, graded: false },
    { assignmentId: 5, grade: null, feedback: "Assignment submitted late. Please review submission guidelines.", submitted: true, graded: false }
  ];

  const getGradeInfo = (assignmentId) => {
    return mockGrades.find(g => g.assignmentId === assignmentId) || { grade: null, feedback: null, submitted: false, graded: false };
  };

  const getGradeBadge = (gradeInfo) => {
    if (!gradeInfo.submitted) {
      return <Badge variant="error" size="sm">Not Submitted</Badge>;
    }
    if (!gradeInfo.graded) {
      return <Badge variant="warning" size="sm">Pending Review</Badge>;
    }
    const grade = gradeInfo.grade;
    if (grade >= 90) return <Badge variant="success" size="sm">{grade}% - A</Badge>;
    if (grade >= 80) return <Badge variant="info" size="sm">{grade}% - B</Badge>;
    if (grade >= 70) return <Badge variant="warning" size="sm">{grade}% - C</Badge>;
    return <Badge variant="error" size="sm">{grade}% - F</Badge>;
  };

  const calculateOverallGrade = () => {
    const gradedAssignments = mockGrades.filter(g => g.graded && g.grade !== null);
    if (gradedAssignments.length === 0) return 0;
    return Math.round(gradedAssignments.reduce((sum, g) => sum + g.grade, 0) / gradedAssignments.length);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-success-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-warning-600";
    return "text-error-600";
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGradesData} />;
  }

  if (assignments.length === 0) {
    return (
      <Empty
        type="grades"
        title="No assignments to grade"
        message="You don't have any assignments yet. Check back once your teacher posts assignments."
      />
    );
  }

  const filteredAssignments = selectedClass 
    ? assignments.filter(a => a.classId === parseInt(selectedClass))
    : assignments;

  const overallGrade = calculateOverallGrade();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Grades</h1>
          <p className="text-slate-600 mt-1">Track your academic progress and view assignment feedback.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="secondary" leftIcon="TrendingUp">
            Grade Report
          </Button>
          <Button variant="primary" leftIcon="Target">
            Grade Goals
          </Button>
        </div>
      </div>

      {/* Overall Grade Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center" gradient>
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mx-auto mb-4">
            <ApperIcon name="Trophy" className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className={`text-3xl font-bold mb-1 ${getGradeColor(overallGrade)}`}>{overallGrade}%</h3>
          <p className="text-sm text-slate-600 font-medium">Overall Grade</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl mx-auto mb-4">
            <ApperIcon name="CheckCircle" className="h-6 w-6 text-success-600" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-1">3</h3>
          <p className="text-sm text-slate-600">Completed</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl mx-auto mb-4">
            <ApperIcon name="Clock" className="h-6 w-6 text-warning-600" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-1">1</h3>
          <p className="text-sm text-slate-600">Pending Review</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-error-100 to-error-200 rounded-xl mx-auto mb-4">
            <ApperIcon name="AlertCircle" className="h-6 w-6 text-error-600" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-1">1</h3>
          <p className="text-sm text-slate-600">Missing</p>
        </Card>
      </div>

      {/* Class Filter */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Filter by Class</h3>
            <p className="text-sm text-slate-600">View grades for specific classes</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.Id} value={cls.Id.toString()}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Assignments List */}
      <div className="space-y-6">
        {filteredAssignments.map((assignment) => {
          const gradeInfo = getGradeInfo(assignment.Id);
          const classInfo = classes.find(c => c.Id === assignment.classId);
          
          return (
            <Card key={assignment.Id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl">
                    <ApperIcon name="FileText" className="h-6 w-6 text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                      {getGradeBadge(gradeInfo)}
                    </div>
                    <p className="text-slate-600 mb-3 line-clamp-2">{assignment.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      <div className="flex items-center">
                        <ApperIcon name="GraduationCap" className="h-4 w-4 mr-2" />
                        <span>{classInfo?.name || "Unknown Class"}</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                        <span>Due {format(new Date(assignment.dueDate), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Star" className="h-4 w-4 mr-2" />
                        <span>{assignment.points} points</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {gradeInfo.graded && gradeInfo.grade !== null && (
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getGradeColor(gradeInfo.grade)}`}>
                        {gradeInfo.grade}%
                      </div>
                      <div className="text-sm text-slate-500">
                        {Math.round(gradeInfo.grade * assignment.points / 100)}/{assignment.points} pts
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/assignments/${assignment.Id}`)}
                    >
                      View Assignment
                    </Button>
                    {gradeInfo.feedback && (
                      <Button variant="ghost" size="sm" leftIcon="MessageSquare">
                        View Feedback
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {gradeInfo.feedback && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="MessageSquare" className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Teacher Feedback</p>
                        <p className="text-sm text-blue-800">{gradeInfo.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Grade Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Grade Trends</h3>
        <div className="text-center py-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-4">
            <ApperIcon name="TrendingUp" className="h-8 w-8 text-slate-500" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">Grade Analytics Coming Soon</h4>
          <p className="text-slate-600 mb-4">Track your progress over time with detailed grade analytics and insights.</p>
          <Badge variant="info" size="sm">Feature Coming Soon</Badge>
        </div>
      </Card>
    </div>
  );
};

export default Grades;