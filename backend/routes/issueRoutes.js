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

import upload from "../middleware/upload.js";

const router = express.Router();


// ============================================
// CITIZEN ROUTES
// ============================================

// Create a new issue with optional image evidence
router.post(
    "/",
    protect,
    citizenOnly,
    upload.single("image"),
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