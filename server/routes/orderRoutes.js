const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  requestReturn,
  handleReturn,
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

// User: cancel own order
router.patch("/:orderId/cancel", cancelOrder);

// User: request return
router.patch("/:orderId/return", requestReturn);

// Admin: approve or reject return
router.patch("/:orderId/return/handle", handleReturn);

module.exports = router;
