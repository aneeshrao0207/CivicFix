import express from "express";
import {
    registerCitizen,
    login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerCitizen);

router.post("/login", login);

export default router;