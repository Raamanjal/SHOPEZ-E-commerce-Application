import express from "express";

import { getBannerData, updateBannerData } from "../contollers/bannerController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBannerData);
router.put("/", protect, adminOnly, updateBannerData);

export default router;
