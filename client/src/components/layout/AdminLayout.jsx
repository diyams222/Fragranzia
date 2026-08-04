import React from "react";
import AdminSidebar from "../admin/AdminSidebar";
import AdminNavBar from "../admin/AdminNavBar";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f7f8fa" }}>
      <AdminNavBar />
      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebar />
        <div style={{ flex: 1, overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;