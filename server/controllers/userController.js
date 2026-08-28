const { User } = require("../models/User");
const bcrypt = require("bcrypt");

// ==================== AUTH ====================

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Signup Successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked. Please contact support." });
    }

    res.status(200).json({ message: "Login Successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin-only login — rejects non-admin credentials
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Only admin accounts may use this endpoint
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin credentials required." });
    }

    res.status(200).json({ message: "Admin Login Successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== PROFILE ====================

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, dob, gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { phone, dob, gender },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile Updated Successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ADDRESS ====================

const saveAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, city, state, landmark, pincode, alternatePhone, addressType } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFirstAddress = user.addresses.length === 0;

    user.addresses.push({
      fullName, phone, address, city, state,
      landmark, pincode, alternatePhone, addressType,
      isPrimary: isFirstAddress,
    });

    await user.save();

    res.status(200).json({ message: "Address saved successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedAddress = user.addresses.find(
      (item) => item._id.toString() === addressId
    );

    user.addresses = user.addresses.filter(
      (item) => item._id.toString() !== addressId
    );

    if (deletedAddress && deletedAddress.isPrimary && user.addresses.length > 0) {
      user.addresses[0].isPrimary = true;
    }

    await user.save();

    res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setPrimaryAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.forEach((address) => {
      address.isPrimary = address._id.toString() === addressId;
    });

    await user.save();

    res.status(200).json({ message: "Primary address updated successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== CART ====================

const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingProduct = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { action } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = user.cart.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        user.cart = user.cart.filter(
          (cartItem) => cartItem.product.toString() !== productId
        );
      }
    }

    await user.save();

    res.status(200).json({ message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== WISHLIST ====================

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyInWishlist) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
      return res.status(200).json({ message: "Removed from wishlist", added: false, wishlist: user.wishlist });
    } else {
      user.wishlist.push(productId);
      await user.save();
      return res.status(200).json({ message: "Added to wishlist", added: true, wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    await user.save();

    res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ADMIN ====================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "name email phone role isBlocked createdAt"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  adminLogin,
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
};