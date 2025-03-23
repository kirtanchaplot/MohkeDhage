import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Utils & Routes
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

// CORS Middleware configuration
app.use(cors({
  origin: [
    "https://mohkedhage.vercel.app", 
    "http://localhost:5173",
    "https://mohke-dhage-em3jgqk8i-kirtans-projects-4eedf56b.vercel.app"
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

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
  res.send("Server is running...");
});

app.listen(port, () => console.log(`Server running on port: ${port}`));



// import path from "path";
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// // Utils & Routes
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

// dotenv.config();
// const port = process.env.PORT || 5000;

// // Database Connection
// connectDB();

// const app = express();

// // ✅ Apply CORS to all routes
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://mohkedhage.vercel.app");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// // ✅ Fix: CORS Middleware at the top
// app.use(cors({
//   origin: ["https://mohkedhage.vercel.app", "http://localhost:5173"], // ✅ No trailing slash
  
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // API Routes
// app.use("/api/users", userRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/orders", orderRoutes);

// // Razorpay Config
// app.get("/api/config/razorpay", (req, res) => {
//   res.send({ clientId: process.env.RAZORPAY_KEY_ID });
// });

// // Static Folder
// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// // Default Route
// app.get("/", (req, res) => {
//   res.send("Server is running...");
// });

// app.listen(port, () => console.log(`Server running on port: ${port}`));





// const cors = require("cors");
// const express = require("express");
// const app = express();

// app.use(cors({
//   origin: ["https://mohkedhage.vercel.app/"], // Replace with your Vercel domain
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));





// // packages
// import path from "path";
// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";


// // Utiles
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

// dotenv.config();
// const port = process.env.PORT || 5000;

// connectDB();

// // const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use("/api/users", userRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/orders", orderRoutes);

// app.get("/",(req,res)=>{
//   res.send("hello 777111");
// });

// app.get("/api/config/razorpay", (req, res) => {
//   res.send({ clientId: process.env.RAZORPAY_KEY_ID });
// });

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname , "/uploads")));

// app.listen(port, () => console.log(`Server running on port: ${port}`));