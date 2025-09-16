import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ClassCard = ({ classData, userRole = "student" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/classes/${classData.Id}`);
  };

  return (
    <Card hover onClick={handleClick} className="p-6 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
<h3 className="text-lg font-bold text-slate-900 mb-1">{classData.Name_c}</h3>
          <p className="text-slate-600 text-sm line-clamp-2">{classData.Description_c}</p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl ml-4">
          <ApperIcon name="GraduationCap" className="h-6 w-6 text-primary-600" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-slate-500">
            <ApperIcon name="Users" className="h-4 w-4 mr-2" />
<span>Active</span>
          </div>
          <div className="flex items-center text-slate-500">
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            <span>{format(new Date(classData.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>

        {userRole === "teacher" && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center text-sm text-slate-600">
              <ApperIcon name="Key" className="h-4 w-4 mr-2" />
<span className="font-mono">{classData.Class_Code_c}</span>
            </div>
            <Badge variant="primary" size="sm">
              {classData.students?.length || 0} enrolled
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ClassCard;