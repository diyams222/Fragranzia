require('dotenv').config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
// const cartRoutes = require(".//routes/cartRoutes");

// 1. Initialize Application
const app = express();

// 2. Middleware Configuration
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON payloads

app.use("/uploads", express.static("uploads"));

// 3. Database Connection
connectDb();

// 4. Route Handling
// Health Check / Test Route
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "success",
    message: "API is working properly" 
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/uploads", express.static("uploads"));
// app.use("/api/cart", cartRoutes);

// 5. Global Error Handling Middleware
// Catches unhandled errors and prevents the server  from crashing
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 6. Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});