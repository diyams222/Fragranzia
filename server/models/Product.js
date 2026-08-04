const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    salePrice: Number,
    quantity: Number,
    tags: [String],
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
    offer: String,
    description: String,
    hasVariants: Boolean,
    images: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);