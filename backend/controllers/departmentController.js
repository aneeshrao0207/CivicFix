import pool from "../config/db.js";

export const getDepartments = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, description
             FROM departments
             ORDER BY name ASC`
        );

        res.json({
            success: true,
            departments: result.rows,
        });

    } catch (error) {
        console.error("Get departments error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch departments.",
        });
    }
};
