import express from "express";
import { getDepartments } from "../controllers/departmentController.js";
import {
    protect,
    adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/",
    protect,
    adminOnly,
    getDepartments
);

export default router;