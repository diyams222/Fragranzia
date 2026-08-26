require("dotenv").config();

const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");

const Product = require("./models/product");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFolder = path.join(__dirname, "uploads");

const migrateImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const products = await Product.find();

    console.log(`Found ${products.length} products`);

    for (const product of products) {
      if (!product.images || product.images.length === 0) {
        console.log(`Skipping "${product.title}" - no image`);
        continue;
      }

      const imageName = product.images[0];

      // Skip images already stored on Cloudinary
      if (imageName.startsWith("https://res.cloudinary.com/")) {
        console.log(`Skipping "${product.title}" - already on Cloudinary`);
        continue;
      }

      const imagePath = path.join(uploadFolder, imageName);

      // Check whether the old image exists
      if (!fs.existsSync(imagePath)) {
        console.log(`❌ Image not found for "${product.title}": ${imageName}`);
        continue;
      }

      console.log(`Uploading "${imageName}" for "${product.title}"...`);

      // Upload old image to Cloudinary
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: "fragnanzia",
      });

      // Update MongoDB with Cloudinary URL
      product.images[0] = result.secure_url;
      await product.save();

      console.log(`✅ Migrated: ${product.title}`);
      console.log(`   ${result.secure_url}`);
    }

    console.log("\n🎉 Image migration completed!");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

migrateImages();