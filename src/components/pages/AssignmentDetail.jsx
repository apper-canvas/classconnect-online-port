import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { format, isAfter, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import assignmentService from "@/services/api/assignmentService";
import classService from "@/services/api/classService";

const AssignmentDetail = ({ userRole }) => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadAssignmentData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const assignmentData = await assignmentService.getById(parseInt(assignmentId));
      setAssignment(assignmentData);
      
      if (assignmentData.classId) {
        const classInfo = await classService.getById(assignmentData.classId);
        setClassData(classInfo);
      }
    } catch (err) {
      setError("Failed to load assignment details. Please try again.");
      console.error("Assignment detail loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      loadAssignmentData();
    }
  }, [assignmentId]);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      toast.error("Please enter your submission content.");
      return;
    }

    try {
      setSubmitting(true);
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      toast.success("Assignment submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit assignment. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAssignmentData} />;
  }

  if (!assignment) {
    return <Error message="Assignment not found." />;
  }

  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isOverdue = isAfter(now, dueDate);
  const daysUntilDue = differenceInDays(dueDate, now);
  
  const getStatusInfo = () => {
    if (submitted) {
      return { label: "Submitted", variant: "success", icon: "CheckCircle" };
    }
    if (isOverdue) {
      return { label: "Overdue", variant: "error", icon: "AlertTriangle" };
    }
    if (daysUntilDue <= 1) {
      return { label: "Due Soon", variant: "warning", icon: "Clock" };
    }
    return { label: "Active", variant: "info", icon: "Circle" };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/assignments")}
          leftIcon="ArrowLeft"
        >
          Back to Assignments
        </Button>
      </div>

      {/* Assignment Header */}
      <Card className="p-6" gradient>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start space-x-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl">
              <ApperIcon name="FileText" className="h-8 w-8 text-accent-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">{assignment.title}</h1>
              {classData && (
                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center">
                    <ApperIcon name="GraduationCap" className="h-4 w-4 mr-2" />
                    <span>{classData.name}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                  <span>Due {format(dueDate, "MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Star" className="h-4 w-4 mr-2" />
                  <span>{assignment.points} points</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 flex items-center space-x-4">
            <Badge variant={statusInfo.variant} size="lg">
              <ApperIcon name={statusInfo.icon} className="h-4 w-4 mr-2" />
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Description */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Assignment Instructions</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed text-base">
                {assignment.description}
              </p>
            </div>
            
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Attachments</h4>
                <div className="space-y-2">
                  {assignment.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <ApperIcon name="Paperclip" className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{attachment.name || `Attachment ${index + 1}`}</span>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Download" className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Submission Area (Students Only) */}
          {userRole === "student" && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Your Submission</h3>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl mx-auto mb-4">
                    <ApperIcon name="CheckCircle" className="h-8 w-8 text-success-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Assignment Submitted!</h4>
                  <p className="text-slate-600 mb-4">Your assignment has been submitted successfully. You'll receive feedback soon.</p>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-700 font-medium">Submitted on:</p>
                    <p className="text-sm text-slate-500">{format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitAssignment} className="space-y-4">
                  <FormField
                    type="textarea"
                    label="Your Answer"
                    placeholder="Enter your assignment submission here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    rows={8}
                    required
                  />
                  
                  <div className="flex items-center space-x-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <ApperIcon name="Upload" className="h-5 w-5 text-amber-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900">Attach Files (Optional)</p>
                      <p className="text-sm text-amber-700">You can attach documents, images, or other files to your submission.</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Browse Files
                    </Button>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={submitting}
                      disabled={isOverdue}
                    >
                      {isOverdue ? "Assignment Overdue" : "Submit Assignment"}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {/* Submissions (Teachers Only) */}
          {userRole === "teacher" && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Student Submissions</h3>
                <Badge variant="info" size="sm">0 of {classData?.students?.length || 0} submitted</Badge>
              </div>
              
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-4">
                  <ApperIcon name="Users" className="h-8 w-8 text-slate-500" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">No Submissions Yet</h4>
                <p className="text-slate-600 mb-4">Students haven't submitted their work for this assignment yet.</p>
                <Button variant="secondary" leftIcon="Send">
                  Send Reminder
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Info */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Assignment Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Status</span>
                <Badge variant={statusInfo.variant} size="sm">
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Due Date</span>
                <span className="font-medium text-slate-900">
                  {format(dueDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Points</span>
                <span className="font-bold text-primary-600">{assignment.points}</span>
              </div>
              {!isOverdue && daysUntilDue >= 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Time Left</span>
                  <span className="font-medium text-slate-900">
                    {daysUntilDue === 0 ? "Due today" : `${daysUntilDue} days`}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Class Info */}
          {classData && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Class Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                    <ApperIcon name="GraduationCap" className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{classData.name}</p>
                    <p className="text-sm text-slate-600">{classData.students?.length || 0} students</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Help Card */}
          <Card className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mx-auto mb-4">
                <ApperIcon name="HelpCircle" className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                {userRole === "student" 
                  ? "Contact your teacher if you have questions about this assignment."
                  : "View submission guidelines and grading rubrics."
                }
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Get Help
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;