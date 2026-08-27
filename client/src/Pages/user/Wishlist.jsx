import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import "./Wishlist.css";
import toast from "react-hot-toast";
import { getUser } from "../../utils/authStorage";
import { getImageUrl } from "../../utils/imageUrl";
import { BASE_URL } from "../../axios";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = getUser();

  useEffect(() => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
     const res = await axios.get(
  `${BASE_URL}/api/users/wishlist/${user._id}`
);
      setWishlistItems(res.data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(
  `${BASE_URL}/api/users/wishlist/${user._id}/${productId}`
);
      setWishlistItems((prev) =>
        prev.filter((item) => item._id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove item from wishlist.");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
     const res = await axios.post(`${BASE_URL}/api/users/cart`, {
  userId: user._id,
  productId,
});
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product to cart.");
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <Navbar />
        <div className="wishlist-loading">Loading your wishlist...</div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <Navbar />

      <div className="wishlist-header">
        <h1>
          <FaHeart className="wl-heart-icon" />
          My Wishlist
        </h1>
        <p className="wishlist-count">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <FaHeart className="empty-heart" />
          <h2>Your wishlist is empty</h2>
          {/* <p>Save products you love by clicking the heart icon on any product card.</p> */}
          <button className="btn-shop-now" onClick={() => navigate("/allproducts")}>
            Explore Products
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <div className="wishlist-card" key={product._id}>
              <div className="wl-img-wrap">
                {product.images?.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.title}
                  />
                ) : (
                  <div style={{ color: "#ccc", fontSize: 40 }}>🖼️</div>
                )}
              </div>

              <div className="wl-card-body">
                <h3 className="wl-title">{product.title}</h3>
                <div className="wl-price-row">
                  <span className="wl-sale-price">RS {product.salePrice}</span>
                  {product.Price && (
                    <span className="wl-original-price">RS {product.Price}</span>
                  )}
                </div>
              </div>

              <div className="wl-actions">
                <button
                  className="btn-add-to-cart"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-remove-wishlist"
                  onClick={() => handleRemoveFromWishlist(product._id)}
                >
                  <FaTrash /> Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
