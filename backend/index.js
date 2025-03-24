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

// Allowed Origins (Update with your Vercel frontend URL)
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://mohke-dhage-aknjcw3p1-kirtans-projects-4eedf56b.vercel.app", // Vercel frontend
  "https://mohke-dhage-1h3spgwpe-kirtans-projects-4eedf56b.vercel.app",
  /^https:\/\/mohke-dhage-.*-kirtans-projects-4eedf56b\.vercel\.app$/
];

// CORS Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
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



