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

// MongoDB connection
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

<<<<<<< HEAD
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
=======
// API Routes
app.use("/api/v1/user", userRoutes);
//app.use("/api/v1/blog", blogRoutes);

>>>>>>> parent of 0669bea (Update server.js)
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

<<<<<<< HEAD
  // 2. Health check endpoint
  app.get('/health', (req, res) => res.status(200).send('OK'));

  // 3. Handle React routing (LAST)
=======
  // API routes should come before the catch-all route
  app.get("/api*", (req, res) => {
    res.redirect("/api/v1" + req.url.slice(4));
  });

>>>>>>> parent of 0669bea (Update server.js)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}



// Port configuration
const PORT = process.env.PORT || 8080;

// Error handling middleware
app.use((err, req, res, next) => {
<<<<<<< HEAD
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
=======
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
>>>>>>> parent of 0669bea (Update server.js)
});