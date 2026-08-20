import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // No session — send to user login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged-in admin must NOT access user pages — redirect to admin dashboard
  if (user.role !== "user") {
    // sessionStorage.adminTab is set on admin login and is tab-local —
    // it is never shared to new tabs. So:
    //   same admin tab  → adminTab is present → redirect to /showpage
    //   fresh new tab   → adminTab is absent  → treat as unauthenticated → /login
    const isAdminTab = sessionStorage.getItem("adminTab") === "true";
    return <Navigate to={isAdminTab ? "/showpage" : "/login"} replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;