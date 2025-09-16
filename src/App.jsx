import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import Layout from "@/components/organisms/Layout";
import RoleSelection from "@/components/pages/RoleSelection";
import TeacherDashboard from "@/components/pages/TeacherDashboard";
import StudentDashboard from "@/components/pages/StudentDashboard";
import Classes from "@/components/pages/Classes";
import Assignments from "@/components/pages/Assignments";
import Gradebook from "@/components/pages/Gradebook";
import Grades from "@/components/pages/Grades";
import Announcements from "@/components/pages/Announcements";
import ClassDetail from "@/components/pages/ClassDetail";
import AssignmentDetail from "@/components/pages/AssignmentDetail";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleRoleSelect = (role, user) => {
    setUserRole(role);
    setCurrentUser(user);
    localStorage.setItem("userRole", role);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
  };

  if (!userRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Routes>
          <Route 
            path="/*" 
            element={
              <Layout userRole={userRole} currentUser={currentUser} onLogout={handleLogout}>
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      userRole === "teacher" ? 
                        <TeacherDashboard /> : 
                        <StudentDashboard />
                    } 
                  />
                  <Route path="/classes" element={<Classes userRole={userRole} />} />
                  <Route path="/classes/:classId" element={<ClassDetail userRole={userRole} />} />
                  <Route path="/assignments" element={<Assignments userRole={userRole} />} />
                  <Route path="/assignments/:assignmentId" element={<AssignmentDetail userRole={userRole} />} />
                  <Route path="/gradebook" element={<Gradebook />} />
                  <Route path="/grades" element={<Grades />} />
                  <Route path="/announcements" element={<Announcements userRole={userRole} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            } 
          />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="toast-custom"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;