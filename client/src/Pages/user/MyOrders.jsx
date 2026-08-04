import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${user._id}`
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    const map = {
      Pending: "#f59e0b",
      Processing: "#3b82f6",
      Shipped: "#8b5cf6",
      Delivered: "#10b981",
      Cancelled: "#ef4444",
    };
    return map[status] || "#888";
  };

  return (
    <>
      <Navbar />

      <div className="orders-page">
        <h1>Profile</h1>

        <p className="breadcrumb">Home / My Orders</p>

        <div className="profile-tabs">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/address")}>Address</button>
          <button className="active">My Orders</button>
        </div>

        <div className="orders-body">
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <h2>No Orders Yet</h2>
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => navigate("/allproducts")}>
                Shop Now
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-card-header">
                  <div>
                    <span className="order-id">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span
                    className="order-status"
                    style={{ background: statusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div className="order-item-row" key={i}>
                      {item.image && (
                        <img
                          src={`http://localhost:5000/uploads/${item.image}`}
                          alt={item.title}
                          className="order-item-img"
                        />
                      )}
                      <div className="order-item-info">
                        <p className="order-item-title">{item.title}</p>
                        <p className="order-item-meta">
                          Qty: {item.quantity} &nbsp;|&nbsp; ₹{item.salePrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span className="order-payment">{order.paymentMethod}</span>
                  <span className="order-total">
                    Total: <strong>₹{order.totalAmount}</strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default MyOrders;