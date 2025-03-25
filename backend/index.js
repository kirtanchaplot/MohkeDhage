import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";  // Import CORS
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

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "http://localhost:5173",
  "https://mohkedhage.vercel.app",
  "https://mohke-dhage-aknjcw3p1-kirtans-projects-4eedf56b.vercel.app", // Old Vercel frontend
  "https://mohke-dhage-1h3spgwpe-kirtans-projects-4eedf56b.vercel.app", // Current Vercel frontend
  /^https:\/\/mohke-dhage-.*-kirtans-projects-4eedf56b\.vercel\.app$/, // Match any Vercel preview URL with this pattern
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// Razorpay Config
app.get("/api/config/razorpay", (req, res) => {
  res.send({ clientId: process.env.RAZORPAY_KEY_ID });
});

// Static Folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running with CORS configured...");
});

// Start Server
app.listen(port, () => console.log(`Server running on port: ${port}`));