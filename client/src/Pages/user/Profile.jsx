import React, { useState } from "react";
import "./Profile.css";
import Navbar from "../../components/user/Navbar";
import { useNavigate } from "react-router-dom";
import { getUser, updateUserSession, clearUserSession } from "../../utils/authStorage";

function Profile() {
  const navigate = useNavigate();

  const user = getUser();

  // Start in editing mode so Save button shows first
  const [isEditing, setIsEditing] = useState(true);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Persist updated fields back to storage
    const updatedUser = { ...user, ...formData };
    updateUserSession(updatedUser);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleLogout = () => {
    clearUserSession();
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <h1>Profile</h1>

        <p className="breadcrumb">Home / Profile</p>

        <div className="tabs">
          <button className="active">Profile</button>

          <button onClick={() => navigate("/address")}>
            Address
          </button>

          <button onClick={() => navigate("/myorders")}>
            My Orders
          </button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <button className="edit-btn save-btn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;