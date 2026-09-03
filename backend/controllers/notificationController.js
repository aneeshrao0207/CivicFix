import pool from "../config/db.js";

export const getMyNotifications = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                n.id,
                n.issue_id,
                n.title,
                n.message,
                n.is_read,
                n.created_at,
                i.report_id
             FROM notifications n
             LEFT JOIN issues i
                ON n.issue_id = i.id
             WHERE n.user_id = $1
             ORDER BY n.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            count: result.rows.length,
            notifications: result.rows,
        });

    } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications.",
        });
    }
};


export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        res.json({
            success: true,
            message: "Notification marked as read.",
            notification: result.rows[0],
        });

    } catch (error) {
        console.error("Mark notification error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update notification.",
        });
    }
};