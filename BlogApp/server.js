const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require('path');
const fs = require('fs');
const pathToRegexp = require('path-to-regexp');
// Define your routes and ensure no route is missing a parameter name

// Environment config
dotenv.config();

// Router imports
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

// MongoDB connection
connectDB();

// Initialize the express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

const uploadsDir = process.env.NODE_ENV === 'production'
  ? '/tmp/uploads'                                // for production (e.g., Render)
  : path.join(__dirname, 'uploads');              // for local development (your own directory)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve the uploads folder publicly
app.use('/uploads', express.static(uploadsDir));

// server.js - Update the production section
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  // API routes should come before the catch-all route
  app.get("/api*", (req, res) => {
    res.redirect("/api/v1" + req.url.slice(4));
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}



// Port configuration
const PORT = process.env.PORT || 8080;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
});