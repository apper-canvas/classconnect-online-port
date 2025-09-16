import ApperIcon from "@/components/ApperIcon";

const Loading = ({ type = "default", className = "" }) => {
  if (type === "dashboard") {
    return (
      <div className={`animate-fade-in ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="skeleton h-6 w-24 rounded"></div>
                <div className="skeleton h-8 w-8 rounded-lg"></div>
              </div>
              <div className="skeleton h-4 w-full rounded mb-2"></div>
              <div className="skeleton h-4 w-3/4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={`animate-fade-in ${className}`}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="skeleton h-6 w-48 rounded"></div>
          </div>
          <div className="p-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="skeleton h-10 w-10 rounded-full"></div>
                  <div>
                    <div className="skeleton h-4 w-32 rounded mb-1"></div>
                    <div className="skeleton h-3 w-24 rounded"></div>
                  </div>
                </div>
                <div className="skeleton h-4 w-16 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className={`animate-fade-in ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="skeleton h-6 w-3/4 rounded mb-3"></div>
              <div className="skeleton h-4 w-full rounded mb-2"></div>
              <div className="skeleton h-4 w-2/3 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="skeleton h-4 w-20 rounded"></div>
                <div className="skeleton h-8 w-20 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <ApperIcon 
            name="Loader2" 
            className="h-8 w-8 text-primary-500 animate-spin" 
          />
          <div className="absolute inset-0 h-8 w-8 border-2 border-primary-200 rounded-full animate-ping"></div>
        </div>
        <div className="text-center">
          <p className="text-slate-600 font-medium">Loading...</p>
          <p className="text-slate-400 text-sm mt-1">Please wait while we fetch your data</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;