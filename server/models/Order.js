const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        image: String,
        salePrice: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // Per-item lifecycle fields
        itemStatus: {
          type: String,
          enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Return Requested", "Returned"],
          default: "Pending",
        },
        cancelledAt: { type: Date, default: null },
        itemReturnRequest: {
          reason: { type: String, default: "" },
          requestedAt: { type: Date, default: null },
          adminNote: { type: String, default: "" },
        },
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      addressType: String,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Google Pay", "Card", "Net Banking"],
      default: "Cash on Delivery",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Return Requested", "Returned"],
      default: "Pending",
    },
    returnRequest: {
      reason: { type: String, default: "" },
      requestedAt: { type: Date },
      adminNote: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
