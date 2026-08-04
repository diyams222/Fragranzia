import React, { useState, useEffect } from 'react';
import "./AddCategory.css";
import AdminNavBar from '../../components/admin/AdminNavBar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Category from "./Category";
import axios from 'axios';

const AddCategory = () => {

  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories from the database
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete a category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  return (
    <>
      <div className="category-layout">

        <AdminNavBar />

        <div className="category-main">

          <AdminSidebar />

          <div className="category-container">

            {/* Top Buttons */}
            <div className="top-sectionn">

              <div className="top-buttons">
                <button>Export</button>
                <button>Import</button>
              </div>

              <button
                className="add-category-btn"
                onClick={() => setShowCategory(true)}
              >
                +Add Category
              </button>

            </div>

            {/* Popup */}
            {
              showCategory && (
                <div className="popup-overlay">

                  <div className="popup-content">
                    <Category
                      setShowCategory={setShowCategory}
                      fetchCategories={fetchCategories}
                    />
                  </div>

                </div>
              )
            }

            {/* Search and Filter */}
            <div className="filter-section">

              <input
                type="text"
                placeholder="Search Categories"
              />

              <select>
                <option>All Categories</option>
              </select>

              <button className="reset-btn">
                Reset Filters
              </button>

            </div>

            {/* Table */}
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Parent Category</th>
                    <th>Actions</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>{category.description || "N/A"}</td>
                      <td>{category.parentCategory || "None"}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <span className="status-badge active">Active</span>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;