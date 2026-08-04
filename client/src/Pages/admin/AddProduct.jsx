import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./AddProduct.css";

const ITEMS_PER_PAGE = 8;

function AddProduct() {
  const navigate = useNavigate();
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("All Categories");
  const [varStatus,  setVarStatus]  = useState("Any Variant Status");
  const [categories, setCategories] = useState([]);
  const [page,       setPage]       = useState(1);

  useEffect(() => {
    fetchProducts();
    axios.get("http://localhost:5000/api/categories")
      .then(r => setCategories(r.data))
      .catch(() => {});
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch { /* ignore */ }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setVarStatus("Any Variant Status");
    setPage(1);
  };

  /* ── Filter ── */
  const filtered = products.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "All Categories" || p.category === category;
    const matchVar    =
      varStatus === "Any Variant Status" ||
      (varStatus === "Has Variants"    &&  p.hasVariants) ||
      (varStatus === "No Variants"     && !p.hasVariants);
    return matchSearch && matchCat && matchVar;
  });

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <AdminNavBar />
      <div className="adp-layout">
        <AdminSidebar />

        <div className="adp-main">

          {/* Top action row */}
          <div className="adp-top-row">
            <div className="adp-top-left">
              <button className="adp-outline-btn">Export</button>
              <button className="adp-outline-btn">Import</button>
            </div>
            <button
              className="adp-add-btn"
              onClick={() => navigate("/products")}
            >
              + Add Product
            </button>
          </div>

          {/* Filter row */}
          <div className="adp-filter-row">
            <input
              className="adp-search"
              placeholder="Search Products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />

            <select
              className="adp-select"
              value={category}
              onChange={e => { setCategory(e.target.value); setPage(1); }}
            >
              <option>All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              className="adp-select"
              value={varStatus}
              onChange={e => { setVarStatus(e.target.value); setPage(1); }}
            >
              <option>Any Variant Status</option>
              <option>Has Variants</option>
              <option>No Variants</option>
            </select>

            <button className="adp-reset-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>

          {/* Table */}
          <div className="adp-table-wrap">
            <table className="adp-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Variants</th>
                  <th>Price</th>
                  <th>Sale Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="adp-empty">Loading products...</td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="adp-empty">
                      No products found matching the filters
                    </td>
                  </tr>
                ) : (
                  paginated.map(p => (
                    <tr key={p._id}>
                      <td className="adp-name-cell">
                        {p.images?.[0] && (
                          <img src={p.images[0]} alt="" className="adp-thumb" />
                        )}
                        <span>{p.title}</span>
                      </td>
                      <td>{p.category || "—"}</td>
                      <td>
                        <span className={`adp-var-badge ${p.hasVariants ? "adp-var-yes" : "adp-var-no"}`}>
                          {p.hasVariants ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>₹{p.price}</td>
                      <td>₹{p.salePrice}</td>
                      <td>{p.quantity ?? "—"}</td>
                      <td>
                        <span className={`adp-status-badge ${p.quantity > 0 ? "adp-status-active" : "adp-status-out"}`}>
                          {p.quantity > 0 ? "Active" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="adp-actions">
                        <button className="adp-edit-btn"
                          onClick={() => navigate(`/products?edit=${p._id}`)}>
                          Edit
                        </button>
                        <button className="adp-del-btn"
                          onClick={() => handleDelete(p._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="adp-pagination">
            <button
              className="adp-page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <span className="adp-page-info">Page {page} of {totalPages}</span>
            <button
              className="adp-page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default AddProduct;