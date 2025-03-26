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
import fs from "fs";

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

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://mohkedhage.vercel.app",
  "https://mohke-dhage-31jjo7x4i-kirtans-projects-4eedf56b.vercel.app", // Current Vercel URL
  /^https:\/\/mohke-dhage-.*\.vercel\.app$/, // Match ANY Vercel deployment URL
  "https://mohkedhage.onrender.com"
];

// CORS Pre-flight middleware
app.options('*', cors());

// CORS Middleware with flexible origin handling
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches pattern
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      }
      // If it's a regex pattern
      return allowedOrigin.test(origin);
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked request from:', origin);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials']
}));

// Global middleware to add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
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
    // Set CORS headers for all static files
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Cache images for 1 day
    if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.gif')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
};

const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir, staticOptions));

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running with CORS configured...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(port, () => console.log(`Server running on port: ${port}`));