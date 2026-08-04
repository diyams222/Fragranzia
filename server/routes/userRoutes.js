const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  updateProfile,
  saveAddress,
  getAddresses,
  deleteAddress,
  setPrimaryAddress,
  addToCart,
  getCart,
  deleteCartItem,
  updateCartQuantity,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getAllUsers,
  toggleBlockUser,
} = require("../controllers/userController");

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Update Profile
router.put("/profile/:id", updateProfile);

router.put("/address/:id", saveAddress);

router.get("/address/:id", getAddresses);

router.delete("/address/:id/:addressId", deleteAddress);

router.put(
  "/address/:id/primary/:addressId",
  setPrimaryAddress
);
router.post("/cart", addToCart);

router.get("/cart/:userId", getCart);

router.delete("/cart/:userId/:productId", deleteCartItem);

router.put("/cart/:userId/:productId", updateCartQuantity);

// Wishlist routes
router.post("/wishlist", addToWishlist);
router.get("/wishlist/:userId", getWishlist);
router.delete("/wishlist/:userId/:productId", removeFromWishlist);

// Admin: get all users
router.get("/all", getAllUsers);

// Admin: block/unblock user
router.put("/block/:id", toggleBlockUser);

module.exports = router;