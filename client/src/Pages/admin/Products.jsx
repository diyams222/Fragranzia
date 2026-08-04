import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdCloudUpload } from "react-icons/md";
import "./Products.css";

const EMPTY_FORM = {
  title: "", price: "", salePrice: "", quantity: "",
  tags: "", category: "", offer: "", description: "", hasVariants: false,
};

function Products() {
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [image,      setImage]      = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState({ msg: "", type: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(r => setCategories(r.data))
      .catch(() => {});
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price || !formData.salePrice) {
      showToast("Please fill in Title, Price and Sale Price.", "error");
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("images", image);

      await axios.post("http://localhost:5000/api/products", data);
      showToast("Product added successfully!");
      setFormData(EMPTY_FORM);
      setImage(null);
      setPreview(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add product.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ap-page">

      {/* Toast */}
      {toast.msg && (
        <div className={`ap-toast ap-toast-${toast.type}`}>{toast.msg}</div>
      )}

      <div className="ap-form-page">

        {/* Header */}
        <div className="ap-form-header">
          <div>
            <h2 className="ap-form-title">Add Product</h2>
            <p className="ap-form-sub">Add your product and necessary information from here</p>
          </div>
          <div className="ap-variants-toggle-row">
            <span className="ap-variants-label">Does this product have variants?</span>
            <label className="ap-switch">
              <input
                type="checkbox" name="hasVariants"
                checked={formData.hasVariants} onChange={handleChange}
              />
              <span className="ap-slider" />
            </label>
          </div>
        </div>

        {/* Row 1 — Title / Price / Sale Price / Quantity */}
        <div className="ap-row-4">
          <div className="ap-field">
            <label>Product Title/Name</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </div>
          <div className="ap-field">
            <label>Product Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} />
          </div>
          <div className="ap-field">
            <label>Sale Price</label>
            <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} />
          </div>
          <div className="ap-field">
            <label>Product Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
          </div>
        </div>

        {/* Row 2 — Tags / Category / Offer */}
        <div className="ap-row-3">
          <div className="ap-field">
            <label>Product Tags</label>
            <input type="text" name="tags" value={formData.tags}
              onChange={handleChange} placeholder="perfume,luxury,men" />
          </div>
          <div className="ap-field">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.length > 0
                ? categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)
                : <>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Gift Sets">Gift Sets</option>
                  </>
              }
            </select>
          </div>
          <div className="ap-field">
            <label>Offer</label>
            <select name="offer" value={formData.offer} onChange={handleChange}>
              <option value="">Select Offer</option>
              <option value="10">10% Off</option>
              <option value="20">20% Off</option>
              <option value="30">30% Off</option>
              <option value="50">50% Off</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="ap-field">
          <label>Product Description</label>
          <textarea name="description" rows={5}
            value={formData.description} onChange={handleChange} />
        </div>

        {/* Image upload */}
        <div className="ap-field">
          <label>Product Image</label>
          <label className="ap-upload-box">
            <input type="file" accept="image/*"
              style={{ display: "none" }} onChange={handleImageChange} />
            {preview ? (
              <img src={preview} alt="preview" className="ap-img-preview" />
            ) : (
              <>
                <MdCloudUpload size={42} color="#b0b8c1" />
                <p>Click to upload or drag &amp; drop (Single image)</p>
              </>
            )}
          </label>
        </div>

        {/* Footer */}
        <div className="ap-form-footer">
          <button
            className="ap-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Products;
