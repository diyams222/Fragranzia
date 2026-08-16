import React from "react";
import AdminLayout from "../layout/AdminLayout";
import { Outlet, Navigate } from "react-router-dom";

const AdminProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminProtectedRoute;