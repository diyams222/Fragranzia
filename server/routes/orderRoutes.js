const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

// Place new order
router.post("/", placeOrder);

// Get orders for a specific user
router.get("/user/:userId", getUserOrders);

// Admin: get all orders
router.get("/", getAllOrders);

// Admin: get single order detail
router.get("/:orderId", getOrderById);

// Admin: update order status
router.put("/:orderId/status", updateOrderStatus);

module.exports = router;
