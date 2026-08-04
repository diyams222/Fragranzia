import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminOrders.css";

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
      alert("Failed to update order status.");
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
    <div className="admin-orders-content">

      {/* Header */}
      <div className="admin-orders-header">
        <h2>All Orders</h2>
        <span className="orders-count">{orders.length} orders</span>
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
                      style={{ background: statusColor(order.status) }}
                    >
                      {order.status}
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
              <h3>Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
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
                  <div className="modal-item" key={i}>
                    {item.image && (
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.title}
                      />
                    )}
                    <div>
                      <p className="modal-item-title">{item.title}</p>
                      <p className="modal-item-meta">
                        Qty: {item.quantity} &nbsp;|&nbsp; ₹{item.salePrice} each
                      </p>
                    </div>
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
                    {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
