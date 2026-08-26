import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUser, getAdminUser } from "../../utils/authStorage";

const UserProtectedRoute = () => {
  const user = getUser();
  const adminUser = getAdminUser();

  // User → Allow user protected pages
  if (user && user.role === "user") {
    return <Outlet />;
  }

  // If an Admin is logged in and tries to access User-only protected pages → Redirect to Home
  if (adminUser && adminUser.role === "admin") {
    return <Navigate to="/home" replace />;
  }

  // Not logged in at all → User Login
  return <Navigate to="/login" replace />;
};

export default UserProtectedRoute;