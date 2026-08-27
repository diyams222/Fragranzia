import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import "./Cart.css";
import toast from "react-hot-toast";
import { getUser } from "../../utils/authStorage";
import { getImageUrl } from "../../utils/imageUrl";
import { BASE_URL } from "../../axios";

function Cart() {
 
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const user = getUser();

      if (!user || !user._id) {
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/users/cart/${user._id}`
      );

      const items = Array.isArray(res.data)
        ? res.data.filter((item) => item && item.product)
        : [];
      setCart(items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const deleteItem = async (productId) => {
    try {
      const user = getUser();
      if (!user || !user._id) return;

      await axios.delete(
        `${BASE_URL}/api/users/cart/${user._id}/${productId}`
      );

      fetchCart();
    } catch (error) {
      console.error("Failed to delete cart item:", error);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      const user = getUser();
      if (!user || !user._id) return;

      await axios.put(
        `${BASE_URL}/api/users/cart/${user._id}/${productId}`,
        { action }
      );

      fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const validCart = Array.isArray(cart) ? cart.filter((item) => item && item.product) : [];

  const totalPrice = validCart.reduce(
    (total, item) =>
      total + (Number(item?.product?.salePrice) || 0) * (Number(item?.quantity) || 0),
    0
  );

  return (
    <>
      <Navbar />

      <div className="cart-page">

        <h1>Cart</h1>

        <p className="breadcrumb">
          Home &gt; Cart
        </p>

        <div className="cart-container">

          {/* Left Side */}

          <div className="cart-items">

            {validCart.length === 0 ? (

              <h2 className="empty-cart">
                Your Cart is Empty
              </h2>

            ) : (

              validCart.map((item) => (

                <div
                  className="cart-item"
                  key={item?.product?._id || item?._id}
                >

                  <div className="cart-image">

                    <img
                      src={getImageUrl(item?.product?.images?.[0])}
                      alt={item?.product?.title || "Product"}
                    />

                  </div>

                  <div className="item-details">

                    <h3>{item?.product?.title}</h3>

                    <div className="quantity">

                      <button
                        onClick={() => updateQuantity(item?.product?._id, "decrease")}
                      >
                        -
                      </button>

                      <span>{item?.quantity || 1}</span>

                      <button
                        onClick={() => updateQuantity(item?.product?._id, "increase")}
                      >
                        +
                      </button>

                    </div>

                    <div className="price-section">

                      <span className="sale-price">
                        Rs {item?.product?.salePrice}
                      </span>

                      {item?.product?.price && (
                        <span className="original-price">
                          Rs {item?.product?.price}
                        </span>
                      )}

                      {item?.product?.price && item?.product?.salePrice ? (
                        <span className="discount">
                          {Math.round(
                            ((item.product.price -
                              item.product.salePrice) /
                              item.product.price) *
                              100
                          )}
                          % off
                        </span>
                      ) : null}

                    </div>

                    <div className="cart-buttons">

                      <button
                        className="delete-btn"
                        onClick={() => deleteItem(item?.product?._id)}
                      >
                        Delete
                      </button>

                      <button className="share-btn">
                        Share
                      </button>

                      <button
                        className="buy-btn"
                        onClick={() =>
                          navigate("/checkout", {
                            state: {
                              cartItems: [item],
                              totalPrice:
                                (Number(item?.product?.salePrice) || 0) *
                                (Number(item?.quantity) || 1),
                            },
                          })
                        }
                      >
                        Buy
                      </button>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* Right Side */}

          <div className="price-details">

            <h2>Check Out</h2>

            <div className="price-row">

              <span>
                Price ({validCart.length} Item{validCart.length !== 1 ? "s" : ""})
              </span>

              <span>
                Rs {totalPrice}
              </span>

            </div>

            <div className="price-row">

              <span>Discount</span>

              <span>Rs 0</span>

            </div>

            <div className="price-row">

              <span>Delivery Charge</span>

              <span className="free">
                Free
              </span>

            </div>

            <hr />

            <div className="price-row total">

              <span>Total Amount</span>

              <span>
                Rs {totalPrice}
              </span>

            </div>

            <button
              className="checkout-btn"
              disabled={validCart.length === 0}
              onClick={() => {
                const user = getUser();
                if (!user) {
                  toast.error("Please login to proceed");
                  navigate("/login");
                  return;
                }
                navigate("/checkout", {
                  state: {
                    cartItems: validCart,
                    totalPrice,
                  },
                });
              }}
            >
              Proceed to Buy
            </button>

            <p className="checkout-note">
              Safe and Secure Payments.
              Easy returns.
              100% Authentic products.
            </p>

          </div>

        </div>

      </div>

      <Footer />

    </>
  );
}

export default Cart;