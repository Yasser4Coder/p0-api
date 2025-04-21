const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }

  // Basic connection monitoring
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected! Check your connection.");
  });
};

module.exports = connectDB;
