const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require('path');
const fs = require('fs');

// Environment config
dotenv.config();

// MongoDB connection
connectDB();

const app = express();

// ======================
// MIDDLEWARE STACK
// ======================

// 1. Basic middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan("dev"));

// 2. Request logger (for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ======================
// API ROUTES (SAFE IMPORT)
// ======================
// Temporary basic routes to isolate the issue
const testRouter = express.Router();
testRouter.get('/test', (req, res) => res.json({ status: 'API working' }));
app.use("/api/v1", testRouter);

// ======================
// FILE HANDLING (RENDER-COMPATIBLE)
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

  // 2. Health check endpoint
  app.get('/health', (req, res) => res.status(200).send('OK'));

  // 3. Handle React routing (LAST)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// ======================
// ERROR HANDLING
// ======================
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.message);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal Server Error'
  });
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`
  Server running in ${process.env.NODE_ENV || 'development'} mode
  Access URL: http://localhost:${PORT}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);
  server.close(() => process.exit(1));
});