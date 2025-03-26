import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

// Database Connection
connectDB();

const app = express();

// Enable compression for all responses
app.use(compression());

// Cache Control Middleware
const cacheControl = (req, res, next) => {
  // Cache static assets for 1 day
  if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico|woff2|woff|ttf)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  } else {
    // Cache API responses for 5 minutes
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  next();
};

app.use(cacheControl);

// CORS Configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'http://localhost:5173' || 
      origin === 'http://localhost:3000' || 
      origin === 'https://mohkedhage.vercel.app' ||
      origin === 'https://mohkedhage.onrender.com') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes with rate limiting
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use("/api/", apiLimiter);
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// Razorpay Config
app.get("/api/config/razorpay", (req, res) => {
  res.send({ clientId: process.env.RAZORPAY_KEY_ID });
});

// Static Folder with caching
const staticOptions = {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.gif')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
};

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads"), staticOptions));

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(port, () => console.log(`Server running on port: ${port}`));