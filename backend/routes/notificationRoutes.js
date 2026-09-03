import express from "express";

import {
    getMyNotifications,
    markNotificationRead,
} from "../controllers/notificationController.js";

import {
    protect,
    citizenOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/",
    protect,
    citizenOnly,
    getMyNotifications
);

router.patch(
    "/:id/read",
    protect,
    citizenOnly,
    markNotificationRead
);

export default router;