import express from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductCategories,
  getProducts,
  updateProduct,
} from "../contollers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories/all", getProductCategories);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
