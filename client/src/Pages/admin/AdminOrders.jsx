import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminOrders.css";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUrl";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update order status.");
    }
  };

  const handleItemStatusChange = async (orderId, itemIndex, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/items/${itemIndex}/status`,
        { status }
      );
      const updatedOrder = res.data.order;
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Failed to update item status:", error);
      toast.error("Failed to update item status.");
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
   * Derives the most meaningful order status from per-item statuses.
   * When all items are cancelled → "Cancelled".
   * Otherwise picks the most-advanced active status (matches backend logic).
   */
  const getDerivedOrderStatus = (order) => {
    const statuses = order.items.map((item) => item.itemStatus || "Pending");
    const allCancelled = statuses.every((s) => s === "Cancelled");
    if (allCancelled) return "Cancelled";
    const priority = ["Returned", "Return Requested", "Delivered", "Shipped", "Processing", "Pending"];
    const activeStatuses = statuses.filter((s) => s !== "Cancelled");
    return priority.find((p) => activeStatuses.includes(p)) || order.status;
  };

  const handleReturn = async (orderId, action) => {
    try {
      const adminNote = action === "reject"
        ? prompt("Optional: Enter a note for the customer (e.g. reason for rejection):")
        : "";
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/return/handle`, {
        action,
        adminNote: adminNote || "",
      });
      const newStatus = action === "approve" ? "Returned" : "Delivered";
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Failed to handle return:", error);
      toast.error("Failed to process return request.");
    }
  };

  return (
    <div className="admin-orders-content">

      {/* Header */}
      <div className="admin-orders-header">
        <h2>All Orders</h2>
        <span className="orders-count">{orders.length} orders</span>
        <button
          onClick={fetchOrders}
          style={{ marginLeft: "auto", padding: "6px 14px", fontSize: 13, background: "#1f2937", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="no-data">No orders found.</p>
      ) : (
        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id-cell">#{order._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div className="customer-cell">
                      <strong>{order.user?.name || "—"}</strong>
                      <span>{order.user?.email || ""}</span>
                    </div>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td>{order.items.length}</td>
                  <td><strong>₹{order.totalAmount}</strong></td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: statusColor(getDerivedOrderStatus(order)) }}
                    >
                      {getDerivedOrderStatus(order)}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Order #{selectedOrder._id.slice(-8).toUpperCase()}
                <span
                  className="status-badge"
                  style={{ background: statusColor(getDerivedOrderStatus(selectedOrder)), marginLeft: 12, fontSize: 12 }}
                >
                  {getDerivedOrderStatus(selectedOrder)}
                </span>
              </h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Customer */}
              <div className="modal-section">
                <h4>Customer</h4>
                <p><strong>Name:</strong> {selectedOrder.user?.name || "—"}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email || "—"}</p>
                <p><strong>Phone:</strong> {selectedOrder.user?.phone || "—"}</p>
              </div>

              {/* Shipping */}
              <div className="modal-section">
                <h4>Shipping Address</h4>
                {selectedOrder.shippingAddress ? (
                  <>
                    <p>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.phone}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state} -{" "}
                      {selectedOrder.shippingAddress.pincode}
                    </p>
                  </>
                ) : (
                  <p>No address info</p>
                )}
              </div>

              {/* Items */}
              <div className="modal-section">
                <h4>Ordered Items</h4>
                {selectedOrder.items.map((item, i) => (
                  <div className="modal-item" key={i} style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
                      {item.image && (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <p className="modal-item-title">{item.title}</p>
                        <p className="modal-item-meta">
                          Qty: {item.quantity}&nbsp;|&nbsp;₹{item.salePrice} each
                        </p>
                      </div>
                      {/* Per-item current status badge */}
                      <span
                        className="status-badge"
                        style={{ background: statusColor(item.itemStatus || "Pending"), flexShrink: 0 }}
                      >
                        {item.itemStatus || "Pending"}
                      </span>
                    </div>
                    {/* Per-item status selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 4 }}>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>Set item status:</span>
                      <select
                        style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "1px solid #d1d5db", cursor: "pointer" }}
                        value={item.itemStatus || "Pending"}
                        onChange={(e) => handleItemStatusChange(selectedOrder._id, i, e.target.value)}
                      >
                        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Return Requested", "Returned"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    {/* Show return reason if item has one */}
                    {item.itemReturnRequest?.reason && (
                      <p style={{ fontSize: 13, color: "#c2410c", margin: "2px 0 0 0" }}>
                        &#128260; Return reason: {item.itemReturnRequest.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="modal-section modal-summary">
                <p><span>Payment Method:</span><strong>{selectedOrder.paymentMethod}</strong></p>
                <p><span>Total Amount:</span><strong>₹{selectedOrder.totalAmount}</strong></p>
                <p>
                  <span>Placed On:</span>
                  <strong>{new Date(selectedOrder.createdAt).toLocaleString("en-IN")}</strong>
                </p>
              </div>

              {/* Status Update */}
              <div className="modal-section">
                <h4>Update Status</h4>
                <div className="status-select-row">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  >
                    {["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Return Requested", "Returned"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span
                    className="status-badge"
                    style={{ background: statusColor(selectedOrder.status) }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Return Request Panel */}
              {selectedOrder.status === "Return Requested" && (
                <div className="modal-section">
                  <h4>Return Request</h4>
                  {selectedOrder.returnRequest?.reason && (
                    <p style={{ marginBottom: 14, color: "#374151", fontSize: 14 }}>
                      <strong>Customer Reason:</strong> {selectedOrder.returnRequest.reason}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      className="return-approve-btn"
                      onClick={() => handleReturn(selectedOrder._id, "approve")}
                    >
                      ✔ Approve Return
                    </button>
                    <button
                      className="return-reject-btn"
                      onClick={() => handleReturn(selectedOrder._id, "reject")}
                    >
                      ✕ Reject Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
