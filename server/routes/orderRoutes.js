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
  cancelOrderItem,
  requestItemReturn,
  updateItemStatus,
} = require("../controllers/orderController");

// Place new order
router.post("/", placeOrder);

// Get orders for a specific user
router.get("/user/:userId", getUserOrders);

// Admin: get all orders
router.get("/", getAllOrders);

// Admin: get single order detail
router.get("/:orderId", getOrderById);

// Admin: update whole order status
router.put("/:orderId/status", updateOrderStatus);

// User: cancel whole order
router.patch("/:orderId/cancel", cancelOrder);

// User: request return for whole order
router.patch("/:orderId/return", requestReturn);

// Admin: approve or reject whole order return
router.patch("/:orderId/return/handle", handleReturn);

// ── Per-item routes ──────────────────────────────────────────
// User: cancel a single item
router.patch("/:orderId/items/:itemIndex/cancel", cancelOrderItem);

// User: request return for a single item
router.patch("/:orderId/items/:itemIndex/return", requestItemReturn);

// Admin: update status of a single item
router.patch("/:orderId/items/:itemIndex/status", updateItemStatus);

module.exports = router;
