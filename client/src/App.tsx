import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Frontend route guard for admin-only pages
interface GuardProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: GuardProps) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Signup */}
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Admin Gated Route */}
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;