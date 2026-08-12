import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // returnForm: { orderId, reason } — tracks which order's return form is open
  const [returnForm, setReturnForm] = useState(null);
  const [returning, setReturning] = useState(false);

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
      "Return Requested": "#f97316",
      Returned: "#6366f1",
    };
    return map[status] || "#888";
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        { userId: user._id }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to cancel order.";
      alert(msg);
    }
  };

  const handleReturnSubmit = async (orderId) => {
    const reason = returnForm?.reason?.trim();
    if (!reason) {
      alert("Please provide a reason for the return.");
      return;
    }
    setReturning(true);
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/return`,
        { userId: user._id, reason }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, status: "Return Requested", returnRequest: res.data.order.returnRequest }
            : o
        )
      );
      setReturnForm(null);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to request return.";
      alert(msg);
    } finally {
      setReturning(false);
    }
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
                          Qty: {item.quantity} &nbsp;|&nbsp; &#8377;{item.salePrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Return reason + admin note display */}
                {["Return Requested", "Returned"].includes(order.status) &&
                  order.returnRequest?.reason && (
                    <div className="return-info-box">
                      <p className="return-info-label">&#128260; Return Reason:</p>
                      <p className="return-info-reason">{order.returnRequest.reason}</p>
                      {order.returnRequest?.adminNote && (
                        <p className="return-admin-note">
                          &#128203; Admin Note: {order.returnRequest.adminNote}
                        </p>
                      )}
                    </div>
                  )}

                {/* Inline return form */}
                {returnForm?.orderId === order._id && (
                  <div className="return-form-panel">
                    <p className="return-form-label">Why do you want to return this order?</p>
                    <textarea
                      className="return-reason-input"
                      placeholder="e.g. Wrong item received, damaged product..."
                      rows={3}
                      value={returnForm.reason}
                      onChange={(e) =>
                        setReturnForm((prev) => ({ ...prev, reason: e.target.value }))
                      }
                    />
                    <div className="return-form-actions">
                      <button
                        className="return-submit-btn"
                        onClick={() => handleReturnSubmit(order._id)}
                        disabled={returning}
                      >
                        {returning ? "Submitting..." : "Submit Return"}
                      </button>
                      <button
                        className="return-cancel-form-btn"
                        onClick={() => setReturnForm(null)}
                        disabled={returning}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="order-card-footer">
                  <span className="order-payment">{order.paymentMethod}</span>
                  <div className="order-footer-right">
                    <span className="order-total">
                      Total: <strong>&#8377;{order.totalAmount}</strong>
                    </span>

                    {/* Cancel — Pending / Processing only */}
                    {["Pending", "Processing"].includes(order.status) && (
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}

                    {/* Return — Delivered only, hide while form is open */}
                    {order.status === "Delivered" &&
                      returnForm?.orderId !== order._id && (
                        <button
                          className="return-order-btn"
                          onClick={() =>
                            setReturnForm({ orderId: order._id, reason: "" })
                          }
                        >
                          Return Order
                        </button>
                      )}
                  </div>
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