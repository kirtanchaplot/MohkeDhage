import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Public routes
router.get("/", fetchProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.get("/allProducts", fetchAllProducts);
router.get("/:id", fetchProductById);
router.post("/filtered-products", filterProducts);

// Protected routes
router.post("/", authenticate, authorizeAdmin, formidable(), addProduct);
router.put("/:id", authenticate, authorizeAdmin, formidable(), updateProductDetails);
router.delete("/:id", authenticate, authorizeAdmin, removeProduct);
router.post("/:id/reviews", authenticate, addProductReview);

export default router;