import express from "express";
import {
    protect,
    citizenOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, citizenOnly, (req, res) => {
    res.json({
        success: true,
        message: "You have access to the citizen API.",
        user: req.user,
    });
});

export default router;