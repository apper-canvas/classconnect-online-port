import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, isAfter, differenceInDays } from "date-fns";

const AssignmentCard = ({ assignment, userRole, className }) => {
  const navigate = useNavigate();
  
  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isOverdue = isAfter(now, dueDate);
  const daysUntilDue = differenceInDays(dueDate, now);
  
  const getStatusBadge = () => {
    if (isOverdue) {
      return <Badge variant="error" size="sm">Overdue</Badge>;
    }
    if (daysUntilDue <= 1) {
      return <Badge variant="warning" size="sm">Due Soon</Badge>;
    }
    if (daysUntilDue <= 7) {
      return <Badge variant="info" size="sm">Upcoming</Badge>;
    }
    return <Badge variant="success" size="sm">Active</Badge>;
  };

  const handleClick = () => {
    navigate(`/assignments/${assignment.Id}`);
  };

  return (
    <Card hover onClick={handleClick} className={`p-6 cursor-pointer ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">{assignment.title}</h3>
          <p className="text-slate-600 text-sm line-clamp-2">{assignment.description}</p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl ml-4">
          <ApperIcon name="FileText" className="h-6 w-6 text-accent-600" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-slate-500">
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            <span>Due {format(dueDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-slate-500">
            <ApperIcon name="Star" className="h-4 w-4 mr-2" />
            <span>{assignment.points} points</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="flex items-center text-xs text-slate-500">
                <ApperIcon name="Paperclip" className="h-3 w-3 mr-1" />
                <span>{assignment.attachments.length}</span>
              </div>
            )}
          </div>
          
          {userRole === "teacher" && (
            <div className="text-xs text-slate-500">
              <span>0 submissions</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AssignmentCard;