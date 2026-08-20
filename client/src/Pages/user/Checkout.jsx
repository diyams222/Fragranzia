import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import "./Checkout.css";
import toast from "react-hot-toast";

function Checkout() {
  const location = useLocation();

  const { cartItems } = location.state || {
    cartItems: [],
  };

  const [cart, setCart] = useState(cartItems);
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
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:5000/api/users/address/${user._id}`
      );

      setAddresses(res.data);

      const primary = res.data.find((item) => item.isPrimary);

      if (primary) {
        setSelectedAddress(primary);
      } else if (res.data.length > 0) {
        setSelectedAddress(res.data[0]);
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

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.product.salePrice * item.quantity,
    0
  );

   return (
    <>
      <Navbar />

      <div className="checkout-page">

        {/* LEFT SIDE */}

        <div className="checkout-left">

          {/* Products */}

          {cart.length === 0 ? (
            <h2>No Products Found</h2>
          ) : (
            cart.map((item, index) => (
              <div
                className="checkout-product"
                key={item.product._id}
              >

                <img
                  src={`http://localhost:5000/uploads/${item.product.images[0]}`}
                  alt={item.product.title}
                  className="checkout-image"
                />

                <div className="checkout-details">

                  <h3>{item.product.title}</h3>

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
  onClick={async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        title: item.product.title,
        image: item.product.images?.[0] || "",
        salePrice: item.product.salePrice,
        quantity: item.quantity,
      }));
      await axios.post("http://localhost:5000/api/orders", {
        userId: user._id,
        items: orderItems,
        shippingAddress: selectedAddress,
        paymentMethod,
        totalAmount: totalPrice,
      });
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
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
        className="home-btn"
        onClick={() => setShowSuccess(false)}
      >
        Back to Home
      </button>

      <button className="track-btn">
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