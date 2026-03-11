import express from "express";

import {
  addToCart,
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
} from "../contollers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getCartItems);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);
router.delete("/", clearCart);

export default router;
