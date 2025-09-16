import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import assignmentService from "@/services/api/assignmentService";
import classService from "@/services/api/classService";

const Gradebook = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGradebookData = async () => {
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
      setError("Failed to load gradebook data. Please try again.");
      console.error("Gradebook loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradebookData();
  }, []);

  const mockStudents = [
    { Id: 1, name: "Alice Johnson", email: "alice@student.edu" },
    { Id: 2, name: "Bob Smith", email: "bob@student.edu" },
    { Id: 3, name: "Carol Davis", email: "carol@student.edu" },
    { Id: 4, name: "David Wilson", email: "david@student.edu" },
    { Id: 5, name: "Emma Brown", email: "emma@student.edu" }
  ];

  const mockGrades = {
    1: { 1: 92, 2: 88, 3: 95 }, // Alice's grades
    2: { 1: 85, 2: 90, 3: 87 }, // Bob's grades
    3: { 1: 78, 2: 82, 3: 85 }, // Carol's grades
    4: { 1: 94, 2: 91, 3: 89 }, // David's grades
    5: { 1: 88, 2: 85, 3: 92 }  // Emma's grades
  };

  const calculateStudentAverage = (studentId) => {
    const grades = mockGrades[studentId] || {};
    const gradeValues = Object.values(grades);
    if (gradeValues.length === 0) return 0;
    return Math.round(gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-success-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-warning-600";
    return "text-error-600";
  };

  const handleGradeChange = (studentId, assignmentId, newGrade) => {
    toast.success("Grade updated successfully!");
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGradebookData} />;
  }

  if (classes.length === 0) {
    return (
      <Empty
        type="classes"
        title="No classes to grade"
        message="Create a class first to start grading student assignments."
      />
    );
  }

  const filteredAssignments = selectedClass 
? assignments.filter(a => a.Class_c?.Id === parseInt(selectedClass) || a.Class_c === parseInt(selectedClass))
    : assignments;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gradebook</h1>
          <p className="text-slate-600 mt-1">Manage and track student grades across all assignments.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="secondary" leftIcon="Download">
            Export Grades
          </Button>
          <Button variant="primary" leftIcon="Calculator">
            Grade Calculator
          </Button>
        </div>
      </div>

      {/* Class Selection */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Select Class</h3>
            <p className="text-sm text-slate-600">Choose a class to view and manage grades</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white"
            >
              <option value="">All Classes</option>
{classes.map(cls => (
                <option key={cls.Id} value={cls.Id.toString()}>{cls.Name_c}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Gradebook Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Student Grades</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="info" size="sm">
                {mockStudents.length} students
              </Badge>
              <Badge variant="primary" size="sm">
                {filteredAssignments.length} assignments
              </Badge>
            </div>
          </div>
        </div>
        
        {filteredAssignments.length === 0 ? (
          <div className="p-6">
            <Empty 
              type="assignments"
              title="No assignments to grade"
              message="Create assignments for this class to start tracking student grades."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student</th>
{filteredAssignments.slice(0, 4).map(assignment => (
                    <th key={assignment.Id} className="px-4 py-4 text-center text-sm font-semibold text-slate-900 min-w-[120px]">
                      <div>
                        <p className="truncate">{assignment.Title_c}</p>
                        <p className="text-xs text-slate-500 font-normal">{assignment.Points_c} pts</p>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Average</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockStudents.map(student => {
                  const average = calculateStudentAverage(student.Id);
                  return (
                    <tr key={student.Id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full">
                            <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{student.name}</p>
                            <p className="text-sm text-slate-600">{student.email}</p>
                          </div>
                        </div>
                      </td>
{filteredAssignments.slice(0, 4).map(assignment => {
                        const grade = mockGrades[student.Id]?.[assignment.Id];
                        return (
                          <td key={assignment.Id} className="px-4 py-4 text-center">
                            {grade ? (
                              <div className="flex flex-col items-center space-y-1">
                                <span className={`font-bold text-lg ${getGradeColor(grade)}`}>
                                  {grade}%
                                </span>
                                <span className="text-xs text-slate-500">
                                  {Math.round(grade * assignment.Points_c / 100)}/{assignment.Points_c}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm">Not graded</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold text-xl ${getGradeColor(average)}`}>
                          {average}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Edit" className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="MessageSquare" className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Grade Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl mx-auto mb-4">
            <ApperIcon name="TrendingUp" className="h-6 w-6 text-success-600" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-1">87.5%</h3>
          <p className="text-sm text-slate-600">Class Average</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mx-auto mb-4">
            <ApperIcon name="Target" className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-1">95%</h3>
          <p className="text-sm text-slate-600">Highest Grade</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl mx-auto mb-4">
            <ApperIcon name="AlertCircle" className="h-6 w-6 text-warning-600" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-1">78%</h3>
          <p className="text-sm text-slate-600">Lowest Grade</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mx-auto mb-4">
            <ApperIcon name="CheckCircle" className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-1">92%</h3>
          <p className="text-sm text-slate-600">Completion Rate</p>
        </Card>
      </div>
    </div>
  );
};

export default Gradebook;