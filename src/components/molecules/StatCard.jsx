import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({
  title,
  value,
  change,
  changeType = "increase",
  icon,
  color = "primary",
  gradient = false
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-gradient-to-br from-primary-50 to-primary-100",
    success: "text-success-600 bg-gradient-to-br from-success-50 to-success-100",
    warning: "text-warning-600 bg-gradient-to-br from-warning-50 to-warning-100",
    error: "text-error-600 bg-gradient-to-br from-error-50 to-error-100",
    info: "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100"
  };

  return (
    <Card className="p-6" gradient={gradient}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={changeType === "increase" ? "TrendingUp" : "TrendingDown"} 
                className={`h-4 w-4 mr-1 ${
                  changeType === "increase" ? "text-success-600" : "text-error-600"
                }`}
              />
              <span className={`text-sm font-medium ${
                changeType === "increase" ? "text-success-600" : "text-error-600"
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${colorClasses[color]}`}>
            <ApperIcon name={icon} className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;