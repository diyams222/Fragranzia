const dns = require("dns");
const mongoose = require("mongoose");

// Configure DNS servers to resolve MongoDB Atlas SRV records on networks/systems where default SRV lookups fail
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if unable to set servers
}

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fragnanzia");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;
