import pool from "../config/db.js";


// ============================================
// CREATE ISSUE
// ============================================

export const createIssue = async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            latitude,
            longitude,
            address,
            imageUrl,
        } = req.body;

        if (!title || !category || !description) {
            return res.status(400).json({
                success: false,
                message: "Title, category and description are required.",
            });
        }

        const reportId = `CF-${Date.now()}`;

        const result = await pool.query(
            `INSERT INTO issues (
                report_id,
                title,
                category,
                description,
                image_url,
                latitude,
                longitude,
                address,
                reported_by
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
            [
                reportId,
                title.trim(),
                category,
                description.trim(),
                imageUrl || null,
                latitude || null,
                longitude || null,
                address || null,
                req.user.id,
            ]
        );

        const issue = result.rows[0];

        // Create initial timeline entry
        await pool.query(
            `INSERT INTO issue_updates
                (issue_id, updated_by, status, note)
             VALUES ($1, $2, $3, $4)`,
            [
                issue.id,
                req.user.id,
                "REPORTED",
                "Issue reported by citizen.",
            ]
        );

        res.status(201).json({
            success: true,
            message: "Issue reported successfully.",
            issue,
        });

    } catch (error) {
        console.error("Create issue error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create issue.",
        });
    }
};


// ============================================
// GET CITIZEN'S ISSUES
// ============================================

export const getMyIssues = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                i.*,
                d.name AS department_name
             FROM issues i
             LEFT JOIN departments d
                ON i.assigned_department = d.id
             WHERE i.reported_by = $1
             ORDER BY i.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            count: result.rows.length,
            issues: result.rows,
        });

    } catch (error) {
        console.error("Get citizen issues error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch your issues.",
        });
    }
};


// ============================================
// GET SINGLE ISSUE
// ============================================

export const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                i.*,
                d.name AS department_name,
                u.name AS reporter_name
             FROM issues i
             LEFT JOIN departments d
                ON i.assigned_department = d.id
             LEFT JOIN users u
                ON i.reported_by = u.id
             WHERE i.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue not found.",
            });
        }

        const issue = result.rows[0];

        const updates = await pool.query(
            `SELECT
                iu.*,
                u.name AS updated_by_name
             FROM issue_updates iu
             LEFT JOIN users u
                ON iu.updated_by = u.id
             WHERE iu.issue_id = $1
             ORDER BY iu.created_at ASC`,
            [id]
        );

        res.json({
            success: true,
            issue,
            timeline: updates.rows,
        });

    } catch (error) {
        console.error("Get issue error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch issue.",
        });
    }
};


// ============================================
// ADMIN — GET ALL ISSUES
// ============================================

export const getAllIssues = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                i.*,
                d.name AS department_name,
                u.name AS reporter_name
             FROM issues i
             LEFT JOIN departments d
                ON i.assigned_department = d.id
             LEFT JOIN users u
                ON i.reported_by = u.id
             ORDER BY i.created_at DESC`
        );

        res.json({
            success: true,
            count: result.rows.length,
            issues: result.rows,
        });

    } catch (error) {
        console.error("Get all issues error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch issues.",
        });
    }
};


// ============================================
// ADMIN — UPDATE ISSUE
// ============================================

export const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            status,
            priority,
            assignedDepartment,
            note,
        } = req.body;

        const existing = await pool.query(
            "SELECT * FROM issues WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue not found.",
            });
        }

        const issue = existing.rows[0];

        const newStatus = status || issue.status;
        const newPriority = priority || issue.priority;
        const newDepartment =
            assignedDepartment !== undefined
                ? assignedDepartment
                : issue.assigned_department;

        const resolvedAt =
            newStatus === "RESOLVED"
                ? "CURRENT_TIMESTAMP"
                : "NULL";

        const query = `
            UPDATE issues
            SET
                status = $1,
                priority = $2,
                assigned_department = $3,
                updated_at = CURRENT_TIMESTAMP,
                resolved_at = ${resolvedAt}
            WHERE id = $4
            RETURNING *
        `;

        const result = await pool.query(query, [
            newStatus,
            newPriority,
            newDepartment || null,
            id,
        ]);

        const updatedIssue = result.rows[0];

        // Add timeline entry
        await pool.query(
            `INSERT INTO issue_updates
                (issue_id, updated_by, status, note)
             VALUES ($1, $2, $3, $4)`,
            [
                id,
                req.user.id,
                newStatus,
                note || `Issue updated by administrator.`,
            ]
        );

        // Notify citizen
        await pool.query(
            `INSERT INTO notifications
                (user_id, issue_id, title, message)
             VALUES ($1, $2, $3, $4)`,
            [
                issue.reported_by,
                id,
                "Issue updated",
                `Your report ${issue.report_id} has been updated to ${newStatus.replace("_", " ")}.`,
            ]
        );

        res.json({
            success: true,
            message: "Issue updated successfully.",
            issue: updatedIssue,
        });

    } catch (error) {
        console.error("Update issue error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update issue.",
        });
    }
};
