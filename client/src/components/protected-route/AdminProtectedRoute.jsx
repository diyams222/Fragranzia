import React from "react";
import AdminLayout from "../layout/AdminLayout";
import { Outlet, Navigate } from "react-router-dom";

const AdminProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in → Admin Login
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Normal user → User Home
  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // Admin → Allow admin pages
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminProtectedRoute;