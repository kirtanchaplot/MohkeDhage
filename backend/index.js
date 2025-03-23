import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Utils & Config
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Load environment variables
dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS Middleware
app.use(
  cors({
    origin: ["https://mohkedhage.vercel.app", "http://localhost:5173"], // Adjust for your frontend
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

// ✅ Custom Headers for Debugging CORS Issues
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Razorpay Config Route
app.get("/api/config/razorpay", (req, res) => {
  res.send({ clientId: process.env.RAZORPAY_KEY_ID });
});

// ✅ Serve Uploaded Images
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server is running... 🚀");
});

// ✅ Start Server
app.listen(port, () => console.log(`Server running on port: ${port}`));







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