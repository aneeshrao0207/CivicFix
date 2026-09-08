import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// ============================================
// CITIZEN REGISTER
// ============================================

export const registerCitizen = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required.",
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO users
                (name, email, password_hash, role, phone)
             VALUES
                ($1, $2, $3, 'citizen', $4)
             RETURNING id, name, email, role, phone, created_at`,
            [
                name.trim(),
                email.toLowerCase(),
                passwordHash,
                phone || null,
            ]
        );

        const user = result.rows[0];

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "Citizen account created successfully.",
            token,
            user,
        });

    } catch (error) {
        console.error("Citizen registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration.",
        });
    }
};


// ============================================
// LOGIN
// ============================================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const result = await pool.query(
            `SELECT id, name, email, password_hash, role, phone
             FROM users
             WHERE email = $1`,
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = generateToken(user);

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
        };

        res.json({
            success: true,
            message: "Login successful.",
            token,
            user: safeUser,
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login.",
        });
    }
};

// ============================================
// UPDATE PROFILE
// ============================================

export const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required.",
            });
        }

        const result = await pool.query(
            `UPDATE users
             SET name = $1,
                 phone = $2
             WHERE id = $3
             RETURNING id, name, email, role, phone, created_at`,
            [
                name.trim(),
                phone ? phone.trim() : null,
                req.user.id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully.",
            user: result.rows[0],
        });

    } catch (error) {
        console.error("Profile update error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating profile.",
        });
    }
};

// ============================================
// CHANGE PASSWORD
// ============================================

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required.",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long.",
            });
        }

        const result = await pool.query(
            `SELECT id, password_hash
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        await pool.query(
            `UPDATE users
             SET password_hash = $1
             WHERE id = $2`,
            [newPasswordHash, req.user.id]
        );

        res.json({
            success: true,
            message: "Password updated successfully.",
        });

    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while changing password.",
        });
    }
};