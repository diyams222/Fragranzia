import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaSlidersH } from "react-icons/fa";
import "./Allproducts.css";
import Navbar from "../../components/user/Navbar";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
  { key: "relevance",  label: "Relevance" },
  { key: "newest",     label: "Newest First" },
  { key: "popularity", label: "Popularity" },
  { key: "price_asc",  label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
];

function applySorting(products, sortKey) {
  const arr = [...products];
  switch (sortKey) {
    case "newest":
      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "popularity":
      // fall back to original order if no popularity field
      return arr;
    case "price_asc":
      return arr.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case "price_desc":
      return arr.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    default:
      return arr; // relevance = original order
  }
}

function Allproduct() {
  const [products,   setProducts]   = useState([]);
  const [wishlist,   setWishlist]   = useState([]);
  const [sortKey,    setSortKey]    = useState("relevance");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const navigate  = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* ── Fetch ── */
  useEffect(() => {
    fetchProducts();
    if (user) fetchWishlist();
  }, []);

  /* Close filter panel on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/wishlist/${user._id}`);
      setWishlist(res.data.map((p) => p._id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (productId) => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) { toast.error("Please login first!"); return; }
    try {
      const res = await axios.post("http://localhost:5000/api/users/cart", {
        userId: u._id,
        productId,
      });
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product to cart");
    }
  };

  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation();
    if (!user) { toast.error("Please login first!"); return; }
    const isWishlisted = wishlist.includes(productId);
    try {
      if (isWishlisted) {
        await axios.delete(`http://localhost:5000/api/users/wishlist/${user._id}/${productId}`);
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post("http://localhost:5000/api/users/wishlist", {
          userId: user._id,
          productId,
        });
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update wishlist.");
    }
  };

  /* ── Compute displayed list ── */
  const displayed = applySorting(products, sortKey);

  return (
    <>
      <Navbar />

      {/* ── Sort / Filter Bar ── */}
      <div className="ap-sortbar">
        <div className="ap-sortbar-left">
          <h1 className="ap-page-title">All Products</h1>
          <p className="ap-breadcrumb">Home &rsaquo; Products</p>
        </div>

        <div className="ap-sortbar-right">
          <span className="ap-sort-label">Sort By:</span>

          <div className="ap-sort-options">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                className={`ap-sort-btn ${sortKey === opt.key ? "ap-sort-btn--active" : ""}`}
                onClick={() => setSortKey(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Filter button + dropdown */}
          <div className="ap-filter-wrap" ref={filterRef}>
            <button
              className={`ap-filter-btn ${filterOpen ? "ap-filter-btn--open" : ""}`}
              onClick={() => setFilterOpen(o => !o)}
            >
              Filter <FaSlidersH className="ap-filter-icon" />
            </button>

            {filterOpen && (
              <div className="ap-filter-dropdown">
                <p className="ap-filter-heading">Sort By</p>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`ap-filter-option ${sortKey === opt.key ? "ap-filter-option--active" : ""}`}
                    onClick={() => { setSortKey(opt.key); setFilterOpen(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="sect1-all">
        {displayed.length === 0 ? (
          <p className="ap-empty">No products found.</p>
        ) : (
          displayed.map((product) => (
            <div
              className="product-card-all"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <button
                className="wishlist-heart-btn-all"
                onClick={(e) => handleToggleWishlist(e, product._id)}
                title={wishlist.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart className={`heart-icon-all ${wishlist.includes(product._id) ? "heart-active-all" : ""}`} />
              </button>

              {product.images?.length > 0 && (
                <img
                  src={`http://localhost:5000/uploads/${product.images[0]}`}
                  alt={product.title}
                />
              )}

              <h3>{product.title}</h3>
              <p className="sprice-all">RS {product.salePrice}</p>
              <p className="oprice-all">RS {product.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product._id);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Allproduct;