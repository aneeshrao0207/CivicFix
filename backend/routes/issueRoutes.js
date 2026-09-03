import express from "express";

import {
    createIssue,
    getMyIssues,
    getIssueById,
    getAllIssues,
    updateIssue,
} from "../controllers/issueController.js";

import {
    protect,
    citizenOnly,
    adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================================
// CITIZEN ROUTES
// ============================================

router.post(
    "/",
    protect,
    citizenOnly,
    createIssue
);

router.get(
    "/my",
    protect,
    citizenOnly,
    getMyIssues
);


// ============================================
// ADMIN ROUTES
// ============================================

router.get(
    "/",
    protect,
    adminOnly,
    getAllIssues
);


// ============================================
// SHARED ISSUE DETAILS
// ============================================

router.get(
    "/:id",
    protect,
    getIssueById
);


// ============================================
// ADMIN UPDATE
// ============================================

router.patch(
    "/:id",
    protect,
    adminOnly,
    updateIssue
);

export default router;