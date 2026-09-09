import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./AdminNotifications.css";

const AdminNotifications = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/issues");

      const issueData = Array.isArray(response)
        ? response
        : response.issues || response.data || [];

      setIssues(issueData);
    } catch (err) {
      console.error("Admin notifications error:", err);
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const notifications = useMemo(() => {
    return [...issues]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.createdAt || 0) -
          new Date(a.created_at || a.createdAt || 0)
      )
      .map((issue) => {
        const priority = String(issue.priority || "medium").toLowerCase();
        const status = String(issue.status || "pending").toLowerCase();

        let type = "recent";
        let icon = <FileText size={20} />;
        let title = "New civic issue reported";
        let message = `A new ${issue.category || "civic"} issue requires administrative attention.`;

        if (priority === "critical") {
          type = "critical";
          icon = <AlertTriangle size={20} />;
          title = "Critical issue requires attention";
          message = `A critical-priority issue has been reported${issue.category ? ` under ${issue.category}` : ""}.`;
        } else if (priority === "high") {
          type = "high";
          icon = <AlertTriangle size={20} />;
          title = "High-priority issue reported";
          message = `A high-priority civic issue may require prompt action.`;
        } else if (status === "resolved") {
          type = "resolved";
          icon = <CheckCircle2 size={20} />;
          title = "Issue resolved";
          message = "A reported civic issue has been marked as resolved.";
        } else if (status === "rejected") {
          type = "rejected";
          icon = <XCircle size={20} />;
          title = "Issue rejected";
          message = "A reported civic issue has been rejected by the authority.";
        } else if (status === "in progress") {
          type = "progress";
          icon = <Clock3 size={20} />;
          title = "Issue is in progress";
          message = "An issue is currently being handled by the assigned department.";
        }

        return {
          ...issue,
          notificationType: type,
          icon,
          title,
          message,
        };
      });
  }, [issues]);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;

    if (filter === "critical") {
      return notifications.filter(
        (notification) =>
          String(notification.priority || "").toLowerCase() === "critical"
      );
    }

    if (filter === "high") {
      return notifications.filter(
        (notification) =>
          String(notification.priority || "").toLowerCase() === "high"
      );
    }

    if (filter === "resolved") {
      return notifications.filter(
        (notification) =>
          String(notification.status || "").toLowerCase() === "resolved"
      );
    }

    return notifications;
  }, [notifications, filter]);

  const criticalCount = notifications.filter(
    (item) => String(item.priority || "").toLowerCase() === "critical"
  ).length;

  const highCount = notifications.filter(
    (item) => String(item.priority || "").toLowerCase() === "high"
  ).length;

  const resolvedCount = notifications.filter(
    (item) => String(item.status || "").toLowerCase() === "resolved"
  ).length;

  const formatTime = (dateValue) => {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Recently";

    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityClass = (priority) => {
    const value = String(priority || "medium").toLowerCase();

    if (value === "critical") return "priority-critical";
    if (value === "high") return "priority-high";
    if (value === "low") return "priority-low";

    return "priority-medium";
  };

  const getStatusLabel = (status) => {
    if (!status) return "Pending";

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <main className="admin-notifications-page">
      <div className="admin-notifications-container">

        {/* Header */}
        <section className="notifications-header">
          <div>
            <div className="notifications-title-row">
              <div className="notifications-title-icon">
                <Bell size={22} />
              </div>

              <div>
                <h1>Notifications</h1>
                <p>
                  Stay updated with important civic activity and issue alerts.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="notifications-refresh-btn"
            onClick={loadIssues}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "refresh-spinning" : ""}
            />
            Refresh
          </button>
        </section>

        {/* Summary */}
        {!loading && !error && (
          <section className="notification-summary">
            <button
              type="button"
              className={`summary-item ${
                filter === "all" ? "summary-active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              <div className="summary-icon summary-blue">
                <Bell size={18} />
              </div>

              <div>
                <strong>{notifications.length}</strong>
                <span>All alerts</span>
              </div>
            </button>

            <button
              type="button"
              className={`summary-item ${
                filter === "critical" ? "summary-active" : ""
              }`}
              onClick={() => setFilter("critical")}
            >
              <div className="summary-icon summary-red">
                <AlertTriangle size={18} />
              </div>

              <div>
                <strong>{criticalCount}</strong>
                <span>Critical</span>
              </div>
            </button>

            <button
              type="button"
              className={`summary-item ${
                filter === "high" ? "summary-active" : ""
              }`}
              onClick={() => setFilter("high")}
            >
              <div className="summary-icon summary-orange">
                <AlertTriangle size={18} />
              </div>

              <div>
                <strong>{highCount}</strong>
                <span>High priority</span>
              </div>
            </button>

            <button
              type="button"
              className={`summary-item ${
                filter === "resolved" ? "summary-active" : ""
              }`}
              onClick={() => setFilter("resolved")}
            >
              <div className="summary-icon summary-green">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <strong>{resolvedCount}</strong>
                <span>Resolved</span>
              </div>
            </button>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <section className="notifications-state">
            <div className="notifications-loader"></div>
            <h3>Loading notifications</h3>
            <p>Fetching the latest civic activity...</p>
          </section>
        )}

        {/* Error */}
        {!loading && error && (
          <section className="notifications-state error-state">
            <div className="state-icon error-icon">
              <AlertTriangle size={24} />
            </div>

            <h3>Unable to load notifications</h3>
            <p>{error}</p>

            <button
              type="button"
              className="retry-btn"
              onClick={loadIssues}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </section>
        )}

        {/* Empty */}
        {!loading && !error && filteredNotifications.length === 0 && (
          <section className="notifications-state">
            <div className="state-icon">
              <Bell size={26} />
            </div>

            <h3>No notifications found</h3>

            <p>
              {filter === "all"
                ? "There are no civic activity alerts available yet."
                : "There are no notifications matching this filter."}
            </p>

            {filter !== "all" && (
              <button
                type="button"
                className="retry-btn"
                onClick={() => setFilter("all")}
              >
                View all alerts
              </button>
            )}
          </section>
        )}

        {/* Notification List */}
        {!loading && !error && filteredNotifications.length > 0 && (
          <section className="notifications-list-section">
            <div className="notifications-list-header">
              <div>
                <h2>Recent activity</h2>
                <p>
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <article
                  className={`notification-card notification-${notification.notificationType}`}
                  key={notification.id}
                >
                  <div className="notification-card-icon">
                    {notification.icon}
                  </div>

                  <div className="notification-content">
                    <div className="notification-main-row">
                      <div>
                        <h3>{notification.title}</h3>

                        <p>{notification.message}</p>
                      </div>

                      <span className="notification-time">
                        {formatTime(
                          notification.created_at || notification.createdAt
                        )}
                      </span>
                    </div>

                    <div className="notification-meta">
                      {notification.report_id && (
                        <span className="report-reference">
                          <FileText size={14} />
                          {notification.report_id}
                        </span>
                      )}

                      {notification.category && (
                        <span className="category-reference">
                          {notification.category}
                        </span>
                      )}

                      <span
                        className={`priority-badge ${getPriorityClass(
                          notification.priority
                        )}`}
                      >
                        {notification.priority || "Medium"}
                      </span>

                      <span className="status-badge">
                        {getStatusLabel(notification.status)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="view-issue-btn"
                      onClick={() =>
                        navigate(`/admin/issues/${notification.id}`)
                      }
                    >
                      View issue
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminNotifications;