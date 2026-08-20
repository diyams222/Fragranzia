import React, { useState } from "react";
import "./Category.css";
import axios from "axios";
import toast from "react-hot-toast";

const Category = ({ setShowCategory, fetchCategories }) => {

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    parentCategory: "",
  });

  const handleChange = (e) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCategory = async () => {
    try {

      const response = await axios.post(
        "http://localhost:5000/api/categories",
        categoryData
      );

      console.log(response.data);

      await fetchCategories();

      toast.success("Category Added");

      setCategoryData({
        name: "",
        description: "",
        parentCategory: "",
      });

      setShowCategory(false);

    } catch (error) {
      console.log(error);
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="Category-boxx">

      <div className="category-eachSelect">

        <div className="namee">Name</div>

        <input
          type="text"
          placeholder="Category title"
          name="name"
          value={categoryData.name}
          onChange={handleChange}
        />

        <div className="descriptionn">Description</div>

        <input
          type="text"
          placeholder="Category description"
          name="description"
          value={categoryData.description}
          onChange={handleChange}
        />

        <div className="parent-categoryy">
          Parent Category
        </div>

        <select
          className="select-none"
          name="parentCategory"
          value={categoryData.parentCategory}
          onChange={handleChange}
        >
          <option value="">None</option>
          <option value="Perfume">Perfume</option>
          <option value="Oil">Oil</option>
        </select>

        <br />

        <div className="two-btns">

          <button
            className="cancel-btn"
            onClick={() => setShowCategory(false)}
          >
            Cancel
          </button>

          <button
            className="addCategory-btn"
            onClick={handleAddCategory}
          >
            Add Category
          </button>

        </div>

      </div>

    </div>
  );
};

export default Category;