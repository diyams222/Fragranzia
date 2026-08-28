import React from "react";
import AdminLayout from "../layout/AdminLayout";
import { Outlet, Navigate } from "react-router-dom";
import { getAdminUser } from "../../utils/authStorage";

const AdminProtectedRoute = () => {
  const adminUser = getAdminUser();

  // Admin → Allow admin pages
  if (adminUser) {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  // Any non-admin or unauthorized user → Redirect to /home
  return <Navigate to="/home" replace />;
};

export default AdminProtectedRoute;