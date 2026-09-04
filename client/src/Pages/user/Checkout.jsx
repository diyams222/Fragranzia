import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import "./Checkout.css";
import toast from "react-hot-toast";
import { getUser } from "../../utils/authStorage";
import { getImageUrl } from "../../utils/imageUrl";
import { BASE_URL } from "../../axios";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems } = location.state || {
    cartItems: [],
  };

  const initialCart = Array.isArray(cartItems)
    ? cartItems.filter((item) => item && item.product)
    : [];

  const [cart, setCart] = useState(initialCart);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const user = getUser();
      if (!user || !user._id) return;

      const res = await axios.get(
        `${BASE_URL}/api/users/address/${user._id}`
      );

      const addressList = Array.isArray(res.data) ? res.data : [];
      setAddresses(addressList);

      const primary = addressList.find((item) => item.isPrimary);

      if (primary) {
        setSelectedAddress(primary);
      } else if (addressList.length > 0) {
        setSelectedAddress(addressList[0]);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = (index, action) => {
    const updatedCart = [...cart];

    if (action === "increase") {
      updatedCart[index].quantity += 1;
    } else if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    }

    setCart(updatedCart);
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

      <div className="checkout-page">

        {/* LEFT SIDE */}

        <div className="checkout-left">

          {/* Products */}

          {validCart.length === 0 ? (
            <h2>No Products Found</h2>
          ) : (
            validCart.map((item, index) => (
              <div
                className="checkout-product"
                key={item?.product?._id || index}
              >

                <img
                  src={getImageUrl(item?.product?.images?.[0])}
                  alt={item?.product?.title || "Product"}
                  className="checkout-image"
                />

                <div className="checkout-details">

                  <h3>{item?.product?.title}</h3>

                  <p className="sale-price">
                    ₹ {item.product.salePrice}
                  </p>

                  <p className="old-price">
                    ₹ {item.product.price}
                  </p>

                  <div className="quantity-box">

                    <button
                      onClick={() =>
                        updateQuantity(index, "decrease")
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(index, "increase")
                      }
                    >
                      +
                    </button>

                  </div>

                  <p className="delivery">
                    Free Delivery
                  </p>

                </div>

              </div>
            ))
          )}

          {/* Personal Details */}

          <div className="checkout-address">

            <div className="address-header">

              <h2>Personal Details</h2>

              <button
  className="change-btn"
  onClick={() => setShowAddresses(!showAddresses)}
>
  Change
</button>

            </div>

            {selectedAddress ? (

              <div className="selected-address">

                <h4>{selectedAddress.addressType}</h4>

                <p>
                  <strong>
                    {selectedAddress.fullName}
                  </strong>
                </p>

                <p>{selectedAddress.phone}</p>

                <p>
                  {selectedAddress.address}
                </p>

                <p>
                  {selectedAddress.city},
                  {" "}
                  {selectedAddress.state}
                  {" - "}
                  {selectedAddress.pincode}
                </p>

              </div>

            ) : (

              <p>No Address Found</p>

            )}

            {showAddresses && (
  <div className="address-list">

    {addresses.map((item, index) => (

      <div
        className="address-card"
        key={index}
      >

        <h4>{item.addressType}</h4>

        <p><strong>{item.fullName}</strong></p>

        <p>{item.phone}</p>

        <p>
          {item.address},
          {item.city},
          {item.state} - {item.pincode}
        </p>

        <button
          className="use-address-btn"
          onClick={() => {
            setSelectedAddress(item);
            setShowAddresses(false);
          }}
        >
          Use this Address
        </button>

      </div>

    ))}

  </div>
)}

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="checkout-right">

          <div className="price-box">

            <h2>Price Details</h2>

            <hr />

            <p>
              <span>Total Items</span>
              <span>{cart.length}</span>
            </p>

            <p>
              <span>Delivery</span>
              <span>Free</span>
            </p>

            <hr />

            <h3>
              ₹ {totalPrice}
            </h3>

          </div>

          <div className="payment-box">

            <h2>Payment Methods</h2>

            <label className="payment-item">

              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "Cash on Delivery"
                }
                onChange={() =>
                  setPaymentMethod(
                    "Cash on Delivery"
                  )
                }
              />

              Cash on Delivery

            </label>

            <label className="payment-item">

              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "Google Pay"
                }
                onChange={() =>
                  setPaymentMethod(
                    "Google Pay"
                  )
                }
              />

              Google Pay

            </label>

            <label className="payment-item">

              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "Card"
                }
                onChange={() =>
                  setPaymentMethod(
                    "Card"
                  )
                }
              />

              Debit / Credit Card

            </label>

            <label className="payment-item">

              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "Net Banking"
                }
                onChange={() =>
                  setPaymentMethod(
                    "Net Banking"
                  )
                }
              />

              Net Banking

            </label>

          </div>

          <button
            className="pay-btn"
            disabled={validCart.length === 0}
            onClick={async () => {
              try {
                const user = getUser();
                if (!user || !user._id) {
                  toast.error("Please login to place an order.");
                  return;
                }
                if (!selectedAddress) {
                  toast.error("Please add or select a delivery address.");
                  return;
                }
                if (validCart.length === 0) {
                  toast.error("No items to purchase.");
                  return;
                }
                const orderItems = validCart.map((item) => ({
                  product: item.product?._id,
                  title: item.product?.title || "Product",
                  image: item.product?.images?.[0] || "",
                  salePrice: item.product?.salePrice || 0,
                  quantity: item.quantity || 1,
                }));
                await axios.post(`${BASE_URL}/api/orders`, {
                  userId: user._id,
                  items: orderItems,
                  shippingAddress: selectedAddress,
                  paymentMethod,
                  totalAmount: totalPrice,
                });

                // Remove successfully ordered items from user's cart
                await Promise.all(
                  orderItems.map((item) =>
                    axios
                      .delete(`${BASE_URL}/api/users/cart/${user._id}/${item.product}`)
                      .catch(() => {})
                  )
                );

                setCart([]);
                setShowSuccess(true);
              } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
              }
            }}
          >
            Pay Now
          </button>

        </div>

      </div>


                {showSuccess && (

<div className="success-overlay">

  <div className="success-popup">

    <div className="success-icon">
      ✓
    </div>

    <h2>Thank You for Ordering!</h2>

    <p>
      Your order has been successfully placed.
    </p>

    <p>
      We're preparing it for shipment.
    </p>

    <div className="success-buttons">

      <button
        type="button"
        className="home-btn"
        onClick={() => {
          setShowSuccess(false);
          navigate("/home");
        }}
      >
        Back to Home
      </button>

      <button
        type="button"
        className="track-btn"
        onClick={() => {
          setShowSuccess(false);
          navigate("/myorders");
        }}
      >
        Track Order
      </button>

    </div>

  </div>

</div>

)}


    </>
  );
}

export default Checkout;