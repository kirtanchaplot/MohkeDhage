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

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "http://localhost:5173",
  "https://mohkedhage.vercel.app",
  "https://mohke-dhage-aknjcw3p1-kirtans-projects-4eedf56b.vercel.app", // Old Vercel frontend
  "https://mohke-dhage-1h3spgwpe-kirtans-projects-4eedf56b.vercel.app", // Current Vercel frontend
  /^https:\/\/mohke-dhage-.*-kirtans-projects-4eedf56b\.vercel\.app$/, // Match any Vercel preview URL with this pattern
  "https://mohkedhage.onrender.com" // Render backend URL
];

// CORS Middleware with flexible origin handling
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches pattern
      const allowed = allowedOrigins.some(allowedOrigin => {
        return typeof allowedOrigin === 'string' 
          ? allowedOrigin === origin
          : allowedOrigin.test(origin);
      });
      
      if (allowed) {
        callback(null, true);
      } else {
        console.log('CORS blocked request from:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: [
      "Origin", 
      "X-Requested-With", 
      "Content-Type", 
      "Accept", 
      "Authorization", 
      "X-Access-Token", 
      "X-Key", 
      "X-Auth-Token"
    ],
    exposedHeaders: ["Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"]
  })
);

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
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
      // Cache images for 1 day
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
};

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads"), staticOptions));

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