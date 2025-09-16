import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ currentUser, onLogout, onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
              <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">ClassConnect</h1>
              <p className="text-xs text-slate-500 -mt-1">Education Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full"></span>
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full">
                <ApperIcon name="User" className="h-4 w-4 text-secondary-700" />
              </div>
              <div className="hidden md:block text-left">
<p className="text-sm font-medium text-slate-900">{currentUser?.firstName} {currentUser?.lastName}</p>
                <p className="text-xs text-slate-500">{currentUser?.emailAddress}</p>
              </div>
              <ApperIcon name="ChevronDown" className="h-4 w-4 text-slate-400" />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
<div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">{currentUser?.firstName} {currentUser?.lastName}</p>
                  <p className="text-xs text-slate-500">{currentUser?.emailAddress}</p>
                  <p className="text-xs text-slate-500">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                >
                  <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center"
                >
                  <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;