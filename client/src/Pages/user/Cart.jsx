import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import "./Cart.css";
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

      if (!user) {
        return;
      }

      const res = await axios.get(
  `${BASE_URL}/api/users/cart/${user._id}`
);

      setCart(res.data);
    } catch (error) {
      console.error(error);
    }
  };

    const deleteItem = async (productId) => {
  try {
    const user = getUser();

   await axios.delete(
  `${BASE_URL}/api/users/cart/${user._id}/${productId}`
);

    fetchCart();

  } catch (error) {
    console.log(error);
  }
};

      const updateQuantity = async (productId, action) => {
  try {
    const user = getUser();

   await axios.put(
  `${BASE_URL}/api/users/cart/${user._id}/${productId}`,
  { action }
);

    fetchCart();

  } catch (error) {
    console.log(error);
  }
};

  const totalPrice = cart.reduce(
    (total, item) => total + item.product.salePrice * item.quantity,
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

            {cart.length === 0 ? (

              <h2 className="empty-cart">
                Your Cart is Empty
              </h2>

            ) : (

              cart.map((item) => (

                <div
                  className="cart-item"
                  key={item.product._id}
                >

                  <div className="cart-image">

                    <img
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product.title}
                    />

                  </div>

                  <div className="item-details">

                    <h3>{item.product.title}</h3>

                    <div className="quantity">

                      <button
  onClick={() => updateQuantity(item.product._id, "decrease")}
>
  -
</button>

<span>{item.quantity}</span>

<button
  onClick={() => updateQuantity(item.product._id, "increase")}
>
  +
</button>

                    </div>

                    <div className="price-section">

                      <span className="sale-price">
                        Rs {item.product.salePrice}
                      </span>

                      <span className="original-price">
                        Rs {item.product.price}
                      </span>

                      <span className="discount">

                        {Math.round(
                          ((item.product.price -
                            item.product.salePrice) /
                            item.product.price) *
                            100
                        )}
                        % off

                      </span>

                    </div>

                    <div className="cart-buttons">

                      <button
  className="delete-btn"
  onClick={() => deleteItem(item.product._id)}
>
  Delete
</button>

                      <button className="share-btn">
                        Share
                      </button>

                      <button className="buy-btn">
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
                Price ({cart.length} Item)
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
  onClick={() =>
    navigate("/checkout", {
      state: {
        cartItems: cart,
        totalPrice,
      },
    })
  }
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