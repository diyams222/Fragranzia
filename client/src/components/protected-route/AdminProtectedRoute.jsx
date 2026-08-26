import React from "react";
import AdminLayout from "../layout/AdminLayout";
import { Outlet, Navigate } from "react-router-dom";
import { getAdminUser, getUser } from "../../utils/authStorage";

const AdminProtectedRoute = () => {
  const adminUser = getAdminUser();
  const user = getUser();

  // Admin → Allow admin pages
  if (adminUser && adminUser.role === "admin") {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  // If a User is already logged in and tries to access an Admin page → Redirect to Home
  if (user && user.role === "user") {
    return <Navigate to="/home" replace />;
  }

  // Not logged in at all → Admin Login
  return <Navigate to="/admin-login" replace />;
};

export default AdminProtectedRoute;