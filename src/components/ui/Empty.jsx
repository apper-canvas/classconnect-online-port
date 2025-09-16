import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  message = "Get started by creating your first item.",
  actionLabel = "Get Started",
  onAction,
  icon = "Package",
  type = "default",
  className = ""
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "classes":
        return {
          title: "No classes yet",
          message: "Create your first class to start managing students and assignments.",
          actionLabel: "Create Class",
          icon: "GraduationCap"
        };
      case "assignments":
        return {
          title: "No assignments yet",
          message: "Create your first assignment to give students work to complete.",
          actionLabel: "Create Assignment",
          icon: "FileText"
        };
      case "students":
        return {
          title: "No students enrolled",
          message: "Share your class code with students so they can join your class.",
          actionLabel: "View Class Code",
          icon: "Users"
        };
      case "submissions":
        return {
          title: "No submissions yet",
          message: "Students haven't submitted any work for this assignment yet.",
          actionLabel: "Send Reminder",
          icon: "Upload"
        };
      case "grades":
        return {
          title: "No grades yet",
          message: "Complete assignments to see your grades appear here.",
          actionLabel: "View Assignments",
          icon: "Trophy"
        };
      case "announcements":
        return {
          title: "No announcements",
          message: "Stay tuned for important updates and information from your teacher.",
          actionLabel: "Refresh",
          icon: "Megaphone"
        };
      default:
        return { title, message, actionLabel, icon };
    }
  };

  const content = getEmptyContent();

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-100 rounded-3xl mb-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl">
              <ApperIcon 
                name={content.icon} 
                className="h-6 w-6 text-primary-600" 
              />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold gradient-text mb-3">
            {content.title}
          </h3>
          <p className="text-slate-600 leading-relaxed text-lg">
            {content.message}
          </p>
        </div>

        {onAction && (
          <div className="space-y-4">
            <Button
              onClick={onAction}
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold"
              variant="primary"
            >
              <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
              {content.actionLabel}
            </Button>
            
            <div className="text-sm text-slate-400">
              <p>Everything you need to get started is just a click away</p>
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success-100 to-success-200 rounded-lg">
                <ApperIcon name="CheckCircle" className="h-4 w-4 text-success-600" />
              </div>
              <p className="text-xs font-medium text-slate-600">Easy Setup</p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-warning-100 to-warning-200 rounded-lg">
                <ApperIcon name="Zap" className="h-4 w-4 text-warning-600" />
              </div>
              <p className="text-xs font-medium text-slate-600">Fast & Reliable</p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg">
                <ApperIcon name="Heart" className="h-4 w-4 text-accent-600" />
              </div>
              <p className="text-xs font-medium text-slate-600">User Friendly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;