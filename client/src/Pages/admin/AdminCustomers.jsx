import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCustomers.css";

function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/block/${userId}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlocked: res.data.isBlocked } : u
        )
      );
      if (selectedUser?._id === userId) {
        setSelectedUser((prev) => ({ ...prev, isBlocked: res.data.isBlocked }));
      }
    } catch (error) {
      console.error("Failed to toggle block:", error);
      alert("Failed to update user status.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="ac-content">
        {/* Header */}
        <div className="ac-header">
          <div>
            <h2 className="ac-title">User List</h2>
            <p className="ac-subtitle">Manage registered customer accounts and status</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="ac-loading">Loading customers...</p>
        ) : users.length === 0 ? (
          <p className="ac-no-data">No customers found.</p>
        ) : (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>PHONE</th>
                  <th>EMAIL</th>
                  <th>ACTIONS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="ac-name-cell">{user.name}</td>
                    <td>{user.phone || "—"}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        id={`show-btn-${user._id}`}
                        className="ac-show-btn"
                        onClick={() => setSelectedUser(user)}
                      >
                        <span className="ac-show-icon">👁</span> Show
                      </button>
                    </td>
                    <td>
                      <button
                        id={`block-btn-${user._id}`}
                        className={`ac-block-btn ${user.isBlocked ? "ac-unblock-btn" : ""}`}
                        onClick={() => handleToggleBlock(user._id)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div
            className="ac-modal-overlay"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="ac-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="ac-modal-header">
                <h3>User Details</h3>
                <button
                  className="ac-modal-close"
                  onClick={() => setSelectedUser(null)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="ac-modal-body">
                <div className="ac-field">
                  <span className="ac-field-label">FULL NAME</span>
                  <p className="ac-field-value">{selectedUser.name}</p>
                  <div className="ac-field-divider" />
                </div>

                <div className="ac-field">
                  <span className="ac-field-label">EMAIL ADDRESS</span>
                  <p className="ac-field-value">{selectedUser.email}</p>
                  <div className="ac-field-divider" />
                </div>

                <div className="ac-field">
                  <span className="ac-field-label">PHONE NUMBER</span>
                  <p className="ac-field-value">{selectedUser.phone || "—"}</p>
                  <div className="ac-field-divider" />
                </div>

                <div className="ac-field-row">
                  <div className="ac-field ac-field-half">
                    <span className="ac-field-label">ACCOUNT STATUS</span>
                    <span
                      className={`ac-status-badge ${
                        selectedUser.isBlocked ? "ac-badge-blocked" : "ac-badge-active"
                      }`}
                    >
                      {selectedUser.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                  <div className="ac-field ac-field-half">
                    <span className="ac-field-label">ROLE</span>
                    <span className="ac-role-badge">
                      {selectedUser.role
                        ? selectedUser.role.charAt(0).toUpperCase() +
                          selectedUser.role.slice(1)
                        : "User"}
                    </span>
                  </div>
                </div>

                <div className="ac-field">
                  <span className="ac-field-label">JOINED DATE</span>
                  <p className="ac-field-value">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="ac-modal-footer">
                <button
                  className="ac-close-footer-btn"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default AdminCustomers;
