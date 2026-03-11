import express from "express";

import {
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "../contollers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
