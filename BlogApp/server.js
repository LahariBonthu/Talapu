const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require('path');
const fs = require('fs');

// Environment config
dotenv.config();

// Router imports
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

// MongoDB connection
connectDB();

// Initialize the express app
const app = express();

// ======================
// MIDDLEWARE STACK
// ======================

// 1. Basic middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 2. Request logger (for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ======================
// API ROUTES
// ======================
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// ======================
// FILE HANDLING
// ======================
const uploadsDir = process.env.NODE_ENV === 'production'
  ? '/tmp/uploads'
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ======================
// CLIENT APP (Production)
// ======================
if (process.env.NODE_ENV === "production") {
  // 1. Serve static files from React build
  app.use(express.static(path.join(__dirname, "client", "build")));

  // 2. Handle React routing (must come after API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// ======================
// ERROR HANDLING
// ======================
app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
}); 