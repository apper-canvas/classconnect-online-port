import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  type = "default",
  className = "" 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } catch (error) {
        console.error("Retry failed:", error);
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "notFound":
        return "SearchX";
      case "permission":
        return "ShieldX";
      default:
        return "AlertTriangle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Problem";
      case "notFound":
        return "Not Found";
      case "permission":
        return "Access Denied";
      default:
        return "Something Went Wrong";
    }
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-error-100 to-error-200 rounded-2xl mb-4">
            <ApperIcon 
              name={getErrorIcon()} 
              className="h-8 w-8 text-error-600" 
            />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {getErrorTitle()}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        {onRetry && (
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full sm:w-auto"
              variant="primary"
            >
              {isRetrying ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                  Retrying...
                </>
              ) : (
                <>
                  <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
            
            <div className="text-sm text-slate-400">
              <p>If the problem persists, please contact support</p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center">
              <ApperIcon name="Shield" className="h-3 w-3 mr-1" />
              Secure
            </div>
            <div className="flex items-center">
              <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
              Real-time
            </div>
            <div className="flex items-center">
              <ApperIcon name="Zap" className="h-3 w-3 mr-1" />
              Fast
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;