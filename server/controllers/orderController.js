const Order = require("../models/Order");

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data." });
    }

    const order = new Order({
      user: userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Failed to place order." });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// Get single order by ID (admin detail view)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "user",
      "name email phone"
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.status(200).json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Failed to fetch order." });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.status(200).json({ message: "Status updated.", order });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update status." });
  }
};

// Cancel order (user)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // Ensure the order belongs to the requesting user
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    // Only allow cancellation for Pending or Processing orders
    if (!['Pending', 'Processing'].includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled. Current status: ${order.status}.`,
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully.", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order." });
  }
};

// Request return (user)
const requestReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Return can only be requested for delivered orders.",
      });
    }

    order.status = "Return Requested";
    order.returnRequest = {
      reason: reason || "No reason provided.",
      requestedAt: new Date(),
      adminNote: "",
    };
    await order.save();

    res.status(200).json({ message: "Return requested successfully.", order });
  } catch (error) {
    console.error("Request return error:", error);
    res.status(500).json({ message: "Failed to request return." });
  }
};

// Handle return (admin: approve or reject)
const handleReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action, adminNote } = req.body; // action: 'approve' | 'reject'

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.status !== "Return Requested") {
      return res.status(400).json({
        message: "Order is not in Return Requested state.",
      });
    }

    if (action === "approve") {
      order.status = "Returned";
    } else if (action === "reject") {
      order.status = "Delivered"; // revert back to delivered
    } else {
      return res.status(400).json({ message: "Invalid action. Use approve or reject." });
    }

    if (order.returnRequest) {
      order.returnRequest.adminNote = adminNote || "";
    }
    await order.save();

    res.status(200).json({ message: `Return ${action}d successfully.`, order });
  } catch (error) {
    console.error("Handle return error:", error);
    res.status(500).json({ message: "Failed to handle return." });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  requestReturn,
  handleReturn,
};
