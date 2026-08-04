const express = require("express");
const router = express.Router();
const upload = require("../middlwares/upload");

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Add product
router.post("/", upload.array("images", 4), addProduct);

// Update product
router.put("/:id", upload.array("images", 4), updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

module.exports = router;