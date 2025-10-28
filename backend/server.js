const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const uploadRoutes = require("./routes/uploadRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Import middleware
const errorHandler = require("./middleware/errorMiddleware");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/upload", uploadRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error middleware
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restro", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
