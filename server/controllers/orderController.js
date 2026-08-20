const Order = require("../models/Order");
const Product = require("../models/Product");

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

    // Decrement each product's stock quantity by the ordered amount
    await Promise.all(
      items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity },
        })
      )
    );

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

      // Restore stock for each item whose return reason is NOT "Damaged"
      const DAMAGED_REASON = "Damaged";
      await Promise.all(
        order.items.map((item) => {
          const reason = item.itemReturnRequest?.reason || order.returnRequest?.reason || "";
          if (reason === DAMAGED_REASON) return Promise.resolve(); // damaged — do NOT restore
          return Product.findByIdAndUpdate(item.product, {
            $inc: { quantity: item.quantity },
          });
        })
      );
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
// Cancel a single item within an order (user)
const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const { userId } = req.body;
    const idx = parseInt(itemIndex, 10);

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized." });

    const item = order.items[idx];
    if (!item) return res.status(404).json({ message: "Item not found." });

    // Treat missing itemStatus (orders created before per-item tracking) as 'Pending'
    const currentStatus = item.itemStatus || 'Pending';
    if (!['Pending', 'Processing'].includes(currentStatus)) {
      return res.status(400).json({ message: `Item cannot be cancelled. Current status: ${currentStatus}.` });
    }

    // Mark this item as cancelled immediately — no admin confirmation required
    order.items[idx].itemStatus = 'Cancelled';
    order.items[idx].cancelledAt = new Date();
    order.markModified('items');

    // Derive the overall order status from the updated item statuses so that
    // the admin table always reflects the most meaningful state.
    const updatedStatuses = order.items.map((itm, i) =>
      i === idx ? 'Cancelled' : (itm.itemStatus || 'Pending')
    );

    const allCancelled = updatedStatuses.every((s) => s === 'Cancelled');
    if (allCancelled) {
      order.status = 'Cancelled';
    } else {
      // Pick the most-advanced non-cancelled status so the admin sees the right state
      const priority = ['Returned', 'Return Requested', 'Delivered', 'Shipped', 'Processing', 'Pending'];
      const activeStatuses = updatedStatuses.filter((s) => s !== 'Cancelled');
      const derived = priority.find((p) => activeStatuses.includes(p)) || 'Pending';
      order.status = derived;
    }

    await order.save();

    // Return a fresh document so the client always gets up-to-date data
    const freshOrder = await Order.findById(orderId);
    res.status(200).json({ message: "Item cancelled successfully.", order: freshOrder });
  } catch (error) {
    console.error("Cancel item error:", error);
    res.status(500).json({ message: "Failed to cancel item." });
  }
};

// Request return for a single item (user)
const requestItemReturn = async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const { userId, reason } = req.body;
    const idx = parseInt(itemIndex, 10);

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized." });

    const item = order.items[idx];
    if (!item) return res.status(404).json({ message: "Item not found." });

    // Treat missing itemStatus (old orders) as 'Pending'
    const currentStatus = item.itemStatus || 'Pending';
    if (currentStatus !== 'Delivered') {
      return res.status(400).json({ message: "Return can only be requested for delivered items." });
    }

    order.items[idx].itemStatus = 'Return Requested';
    order.items[idx].itemReturnRequest = {
      reason: reason || 'No reason provided.',
      requestedAt: new Date(),
      adminNote: '',
    };
    order.markModified('items');
    await order.save();

    const freshOrder = await Order.findById(orderId);
    res.status(200).json({ message: "Return requested successfully.", order: freshOrder });
  } catch (error) {
    console.error("Request item return error:", error);
    res.status(500).json({ message: "Failed to request return." });
  }
};

// Admin: update status of a single item
const updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const { status } = req.body;
    const idx = parseInt(itemIndex, 10);

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (!order.items[idx]) return res.status(404).json({ message: "Item not found." });

    const previousStatus = order.items[idx].itemStatus || 'Pending';
    order.items[idx].itemStatus = status;
    order.markModified('items');
    await order.save();

    // When admin marks a per-item return as approved (Returned), restore stock
    // ONLY if the return reason is NOT "Damaged".
    if (status === 'Returned' && previousStatus !== 'Returned') {
      const DAMAGED_REASON = 'Damaged';
      const item = order.items[idx];
      const reason = item.itemReturnRequest?.reason || '';
      if (reason !== DAMAGED_REASON) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    res.status(200).json({ message: "Item status updated.", order });
  } catch (error) {
    console.error("Update item status error:", error);
    res.status(500).json({ message: "Failed to update item status." });
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
  cancelOrderItem,
  requestItemReturn,
  updateItemStatus,
};
