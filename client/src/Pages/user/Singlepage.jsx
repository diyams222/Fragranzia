import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Singlepage.css";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import toast from "react-hot-toast";
import { getUser } from "../../utils/authStorage";
import { getImageUrl } from "../../utils/imageUrl";
import { BASE_URL } from "../../axios";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { IoPricetag } from "react-icons/io5";

function Singlepage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [suggestedPage, setSuggestedPage] = useState(0);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
    fetchProduct();
    fetchProducts();
    checkWishlistStatus();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const checkWishlistStatus = async () => {
    const user = getUser();
    if (!user || !user._id) {
      setIsWishlisted(false);
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/api/users/wishlist/${user._id}`);
      if (Array.isArray(res.data)) {
        const inWishlist = res.data.some(
          (item) => (item?._id || item) === id
        );
        setIsWishlisted(inWishlist);
      }
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  };

  const handleToggleWishlist = async () => {
    const user = getUser();
    if (!user || !user._id) {
      toast.error("Please login to manage wishlist!");
      return;
    }

    try {
      if (isWishlisted) {
        await axios.delete(`${BASE_URL}/api/users/wishlist/${user._id}/${product._id}`);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(`${BASE_URL}/api/users/wishlist`, {
          userId: user._id,
          productId: product._id,
        });
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.title || "Fragranzia Product",
          text: `Check out ${product?.title} on Fragranzia!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleAddToCart = async (targetProduct, targetQty = 1) => {
    const user = getUser();
    if (!user || !user._id) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/users/cart`, {
        userId: user._id,
        productId: targetProduct._id,
        quantity: targetQty,
      });
      toast.success(res.data.message || "Added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product to cart");
    }
  };

  const handleBuyNow = () => {
    const user = getUser();
    if (!user || !user._id) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems: [
          {
            product,
            quantity: qty,
          },
        ],
        totalPrice: (Number(product.salePrice) || 0) * qty,
      },
    });
  };

  // Dynamic delivery date calculation (current date + 3 days)
  const getDeliveryInfo = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const day = deliveryDate.toLocaleDateString("en-IN", { day: "numeric" });
    const month = deliveryDate.toLocaleDateString("en-IN", { month: "short" });
    const weekday = deliveryDate.toLocaleDateString("en-IN", { weekday: "long" });
    return `${day} ${month}, ${weekday}`;
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="singlepage-loading">
          <p>Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  const originalPrice = Number(product.price || product.Price || 0);
  const salePrice = Number(product.salePrice || 0);
  const discountPercent =
    originalPrice > salePrice && originalPrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : null;

  const brandName =
    product.title?.split(" ")[0] || "Fragranzia";

  return (
    <>
      <Navbar />

      <div className="singlepage-wrapper">
        {/* Breadcrumbs */}
        <div className="singlepage-breadcrumb">
          <span onClick={() => navigate("/home")} className="crumb-link">
            Home
          </span>
          <span className="crumb-sep">&gt;</span>
          <span onClick={() => navigate("/allproducts")} className="crumb-link">
            Products
          </span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">{product.title}</span>
        </div>

        {/* Main Product Layout */}
        <div className="single-main-layout">
          {/* Left Column: Image & Direct Action Buttons */}
          <div className="single-left-col">
            <div className="single-image-card">
              {/* Floating Action Buttons */}
              <div className="image-floating-actions">
                <button
                  type="button"
                  className={`floating-action-btn ${isWishlisted ? "wishlisted" : ""}`}
                  onClick={handleToggleWishlist}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlisted ? (
                    <FaHeart className="heart-icon active" />
                  ) : (
                    <FaRegHeart className="heart-icon" />
                  )}
                </button>

                <button
                  type="button"
                  className="floating-action-btn"
                  onClick={handleShare}
                  title="Share product"
                >
                  <FiShare2 className="share-icon" />
                </button>
              </div>

              {/* Featured Image */}
              {product.images?.length > 0 ? (
                <img
                  src={getImageUrl(product.images[0])}
                  alt={product.title}
                  className="single-featured-image"
                />
              ) : (
                <div className="no-image-placeholder">No image available</div>
              )}
            </div>

            {/* Action Buttons Below Image */}
            <div className="single-action-buttons">
              <button
                type="button"
                className="single-purchase-btn"
                onClick={handleBuyNow}
              >
                Purchase Now
              </button>

              <button
                type="button"
                className="single-cart-btn"
                onClick={() => handleAddToCart(product, qty)}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="single-right-col">
            <h1 className="single-product-title">{product.title}</h1>
            <p className="single-product-brand">{brandName}</p>

            {/* Rating */}
            <div className="single-rating-row">
              <span className="single-rating-score">
                4.5 <FaStar className="star-icon" />
              </span>
              <span className="single-rating-count">1,000 Ratings</span>
            </div>

            {/* Stock Alert */}
            <p className="single-stock-alert">
              Hurry only few stocks left!
            </p>

            {/* Price Row */}
            <div className="single-price-row">
              <span className="single-sale-price">Rs {salePrice}</span>
              {originalPrice > 0 && (
                <span className="single-old-price">Rs {originalPrice}</span>
              )}
              {discountPercent ? (
                <span className="single-discount-badge">{discountPercent}% off</span>
              ) : product.offer ? (
                <span className="single-discount-badge">{product.offer}</span>
              ) : null}
            </div>

            {/* Quantity Selector */}
            <div className="single-qty-box">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            {/* Delivery Section */}
            <div className="single-info-section">
              <h3 className="section-title">Delivery</h3>
              <p className="delivery-main-text">
                Delivery by {getDeliveryInfo()} | Free
              </p>
              <p className="delivery-sub-text">
                if ordered before 9:24 PM
              </p>
            </div>

            {/* Description Section */}
            <div className="single-info-section">
              <h3 className="section-title">Description</h3>
              <p className="description-text">
                {product.description ||
                  "This fragrance exudes a confident and enigmatic personality. Its composition features top notes that enhance freshness with warm rich undertones, beautifully wrapped in long-lasting premium scent."}
              </p>
            </div>

            {/* Available Offers Section */}
            <div className="single-info-section offers-section">
              <h3 className="section-title">Available Offers</h3>
              <ul className="offers-list">
                <li>
                  <IoPricetag className="offer-tag-icon" />
                  <span>Buy two of the same product and get a third one free.</span>
                </li>
                <li>
                  <IoPricetag className="offer-tag-icon" />
                  <span>Enjoy free standard shipping on orders exceeding &#8377;1,399.</span>
                </li>
                <li>
                  <IoPricetag className="offer-tag-icon" />
                  <span>Get 15% off your first order</span>
                </li>
                <li>
                  <IoPricetag className="offer-tag-icon" />
                  <span>Receive a free tool case with the purchase of any perfume over &#8377;2,000</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Suggested Products ---------- */}

      <div className="sforu">
        <h2>Suggested For You</h2>
      </div>

      <div className="featured-section">
        {suggestedPage > 0 && (
          <button
            className="featured-prev-btn"
            onClick={() => setSuggestedPage((prev) => prev - 1)}
          >
            &#8249;
          </button>
        )}

        <div className="perfumes">
          {products
            .filter((item) => item && item._id !== product._id)
            .slice(suggestedPage * 5, suggestedPage * 5 + 5)
            .map((item) => (
              <div
                className="product-card"
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
              >
                {item.images?.length > 0 && (
                  <img
                    src={getImageUrl(item.images[0])}
                    alt={item.title}
                  />
                )}

                <h3>{item.title}</h3>

                <p className="sprice">RS {item.salePrice}</p>

                <p className="oprice">RS {item.Price || item.price}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item, 1);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
        </div>

        {products.filter((item) => item._id !== product._id).length >
          suggestedPage * 5 + 5 && (
          <button
            className="featured-next-btn"
            onClick={() => setSuggestedPage((prev) => prev + 1)}
          >
            &#8250;
          </button>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Singlepage;