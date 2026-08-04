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

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
