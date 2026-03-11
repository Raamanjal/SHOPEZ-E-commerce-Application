import express from "express";

import {
  getAdminConfig,
  getDashboardStats,
  updateAdminConfig,
} from "../contollers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/dashboard", getDashboardStats);
router.get("/config", getAdminConfig);
router.put("/config", updateAdminConfig);

export default router;
