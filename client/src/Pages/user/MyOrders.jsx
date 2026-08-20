import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import "./MyOrders.css";
import toast from "react-hot-toast";

const RETURN_REASONS = ["Damaged", "Wrong product received"];

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // returnForm: { orderId, itemIndex, reason } — tracks which item's return dropdown is open
  const [returnForm, setReturnForm] = useState(null);
  const [returning, setReturning] = useState(false);

  // cancellingItem: "orderId-itemIndex" string while a cancel request is in-flight
  const [cancellingItem, setCancellingItem] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      toast.error("Please login first!");
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

  /**
   * Derives the order-header display status from per-item statuses.
   * - Shows "Cancelled" ONLY when every item is cancelled.
   * - Otherwise falls back to the admin-set order.status.
   */
  const getOrderDisplayStatus = (order) => {
    const itemStatuses = order.items.map((item) => item.itemStatus || "Pending");
    const allCancelled = itemStatuses.every((s) => s === "Cancelled");
    if (allCancelled) return "Cancelled";
    // If the admin hasn't changed the overall status to something misleading,
    // keep it. But if it says Cancelled while not all items are cancelled, show
    // the most-advanced non-cancelled status instead.
    if (order.status === "Cancelled" && !allCancelled) {
      // Derive from items: pick the "most advanced" active status
      const priority = ["Returned", "Return Requested", "Delivered", "Shipped", "Processing", "Pending"];
      for (const p of priority) {
        if (itemStatuses.includes(p)) return p;
      }
    }
    return order.status;
  };

  // ── Per-item cancel ───────────────────────────────────────────
  const handleCancelItem = async (orderId, itemIndex) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this item? This cannot be undone."
    );
    if (!confirmed) return;

    const key = `${orderId}-${itemIndex}`;
    setCancellingItem(key);
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/items/${itemIndex}/cancel`,
        { userId: user._id }
      );
      // Replace the updated order in state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
      toast.success("Item cancelled successfully.");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to cancel item.";
      toast.error(msg);
    } finally {
      setCancellingItem(null);
    }
  };

  // ── Per-item return ───────────────────────────────────────────
  const handleReturnSubmit = async () => {
    if (!returnForm?.reason) {
      toast.error("Please select a return reason.");
      return;
    }
    setReturning(true);
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/orders/${returnForm.orderId}/items/${returnForm.itemIndex}/return`,
        { userId: user._id, reason: returnForm.reason }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === returnForm.orderId ? res.data.order : o))
      );
      setReturnForm(null);
      toast.success("Return requested successfully.");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to request return.";
      toast.error(msg);
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

              {/* ── Order header ── */}
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
                  {/* Show overall derived status — no Cancel button at order level */}
                  <span
                    className="order-status"
                    style={{ background: statusColor(getOrderDisplayStatus(order)) }}
                  >
                    {getOrderDisplayStatus(order)}
                  </span>
                </div>

                {/* ── Items list ── */}
                <div className="order-items">
                  {order.items.map((item, i) => {
                    const iStatus = item.itemStatus || "Pending";
                    const isReturnFormOpen =
                      returnForm?.orderId === order._id &&
                      returnForm?.itemIndex === i;

                    return (
                      <div key={i}>
                        <div className="order-item-row">
                          {item.image && (
                            <img
                              src={`http://localhost:5000/uploads/${item.image}`}
                              alt={item.title}
                              className="order-item-img"
                            />
                          )}

                          <div className="order-item-info" style={{ flex: 1 }}>
                            <p className="order-item-title">{item.title}</p>
                            <p className="order-item-meta">
                              Qty: {item.quantity}&nbsp;|&nbsp;&#8377;{item.salePrice}
                            </p>
                          </div>

                          {/* Per-item status badge */}
                          <span
                            className="order-status"
                            style={{
                              background: statusColor(iStatus),
                              fontSize: "12px",
                              padding: "4px 10px",
                              flexShrink: 0,
                            }}
                          >
                            {iStatus}
                          </span>

                          {/* Per-item action buttons */}
                          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                            {/* Cancel — only when Pending or Processing, shown per-item only */}
                            {["Pending", "Processing"].includes(iStatus) && (() => {
                              const key = `${order._id}-${i}`;
                              const isCancelling = cancellingItem === key;
                              return (
                                <button
                                  className="cancel-order-btn"
                                  onClick={() => handleCancelItem(order._id, i)}
                                  disabled={isCancelling}
                                  style={isCancelling ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                                >
                                  {isCancelling ? "Cancelling…" : "Cancel"}
                                </button>
                              );
                            })()}

                            {/* Return — only when Delivered, dropdown not open */}
                            {iStatus === "Delivered" && !isReturnFormOpen && (
                              <button
                                className="return-order-btn"
                                onClick={() =>
                                  setReturnForm({
                                    orderId: order._id,
                                    itemIndex: i,
                                    reason: "",
                                  })
                                }
                              >
                                Return
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Return reason display (after return requested) */}
                        {["Return Requested", "Returned"].includes(iStatus) &&
                          item.itemReturnRequest?.reason && (
                            <div className="return-info-box" style={{ margin: "6px 0 0 78px" }}>
                              <p className="return-info-label">&#128260; Return Reason:</p>
                              <p className="return-info-reason">
                                {item.itemReturnRequest.reason}
                              </p>
                              {item.itemReturnRequest?.adminNote && (
                                <p className="return-admin-note">
                                  &#128203; Admin Note: {item.itemReturnRequest.adminNote}
                                </p>
                              )}
                            </div>
                          )}

                        {/* Return reason dropdown — shown inline below the item */}
                        {isReturnFormOpen && (
                          <div className="return-form-panel" style={{ margin: "8px 0 0 78px" }}>
                            <p className="return-form-label">Why do you want to return this item?</p>
                            <select
                              className="return-reason-input"
                              style={{ height: "42px", cursor: "pointer" }}
                              value={returnForm.reason}
                              onChange={(e) =>
                                setReturnForm((prev) => ({ ...prev, reason: e.target.value }))
                              }
                            >
                              <option value="">-- Select a reason --</option>
                              {RETURN_REASONS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                            <div className="return-form-actions">
                              <button
                                className="return-submit-btn"
                                onClick={handleReturnSubmit}
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
                      </div>
                    );
                  })}
                </div>

                {/* ── Order footer (payment + total) ── */}
                <div className="order-card-footer">
                  <span className="order-payment">{order.paymentMethod}</span>
                  <div className="order-footer-right">
                    <span className="order-total">
                      Total: <strong>&#8377;{order.totalAmount}</strong>
                    </span>
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