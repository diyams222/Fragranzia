const Product = require("../models/Product");

// GET PRODUCTS

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

  // GET SINGLE PRODUCT

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD PRODUCT

const addProduct = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    console.log("FILES:", req.files);
  const imagePaths = req.files
  ? req.files.map((file) => file.path)
  : [];

      console.log("BODY:", req.body);
      console.log("FILES:", req.files);
      console.log("IMAGE PATHS:", imagePaths);

    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      salePrice: req.body.salePrice,
      quantity: req.body.quantity,
      category: req.body.category,
      offer: req.body.offer,
      description: req.body.description,
      hasVariants: req.body.hasVariants === "true",
      images: imagePaths,
    });
  


      



    console.log("PRODUCT SAVED:", product);

    res.status(201).json(product);
  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
 
  // DELETE PRODUCT

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const updates = {
      title:       req.body.title,
      price:       req.body.price,
      salePrice:   req.body.salePrice,
      quantity:    req.body.quantity,
      category:    req.body.category,
      description: req.body.description,
      hasVariants: req.body.hasVariants === "true",
    };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(f => f.path);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};