import express from "express";

import {
    registerCitizen,
    login,
    updateProfile,
    changePassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================================
// AUTHENTICATION
// ============================================

router.post("/register", registerCitizen);

router.post("/login", login);


// ============================================
// PROFILE
// ============================================

router.patch("/profile", protect, updateProfile);

router.patch("/password", protect, changePassword);


export default router;