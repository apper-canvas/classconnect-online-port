import { NavLink } from "react-router-dom";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose, userRole = "student" }) => {
  const teacherMenuItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/classes", label: "Classes", icon: "GraduationCap" },
    { path: "/assignments", label: "Assignments", icon: "FileText" },
    { path: "/gradebook", label: "Gradebook", icon: "Trophy" },
    { path: "/announcements", label: "Announcements", icon: "Megaphone" },
  ];

  const studentMenuItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/classes", label: "Classes", icon: "GraduationCap" },
    { path: "/assignments", label: "Assignments", icon: "FileText" },
    { path: "/grades", label: "Grades", icon: "Trophy" },
    { path: "/announcements", label: "Announcements", icon: "Megaphone" },
  ];

  const menuItems = userRole === "teacher" ? teacherMenuItems : studentMenuItems;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text">ClassConnect</h2>
<p className="text-xs text-slate-500">Education Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary-600" : "text-slate-400"
                      )} 
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
              <ApperIcon name="Sparkles" className="h-4 w-4 text-primary-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Need Help?</h3>
          </div>
          <p className="text-sm text-slate-600 mb-3">
            Get support and tutorials for ClassConnect
          </p>
          <button className="text-xs text-primary-600 font-medium hover:text-primary-700">
            View Help Center →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div 
          className={cn(
            "fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold gradient-text">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-200 shadow-sm">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;