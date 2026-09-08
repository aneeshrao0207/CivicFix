import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  FileText,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { apiRequest } from "../../services/api";
import "./CitizenNotifications.css";

const getNotificationIcon = (notification) => {
  const text = `${notification.title || ""} ${
    notification.message || notification.body || ""
  }`.toLowerCase();

  if (
    text.includes("resolved") ||
    text.includes("complete") ||
    text.includes("completed")
  ) {
    return Check;
  }

  if (
    text.includes("reject") ||
    text.includes("rejected")
  ) {
    return XCircle;
  }

  if (
    text.includes("progress") ||
    text.includes("update") ||
    text.includes("assigned")
  ) {
    return RefreshCw;
  }

  return FileText;
};

const formatNotificationTime = (date) => {
  if (!date) return "";

  const notificationDate = new Date(date);
  const now = new Date();

  const difference = now.getTime() - notificationDate.getTime();

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return notificationDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getNotificationDate = (notification) =>
  notification.created_at ||
  notification.createdAt ||
  notification.timestamp ||
  notification.date;

const getNotificationMessage = (notification) =>
  notification.message ||
  notification.body ||
  notification.description ||
  "You have a new update regarding your CivicFix activity.";

const getNotificationIssueId = (notification) =>
  notification.issue_id ||
  notification.issueId ||
  notification.report_id ||
  notification.reportId ||
  null;

const isUnread = (notification) =>
  notification.is_read === false ||
  notification.isRead === false ||
  notification.read === false ||
  notification.read_at === null ||
  notification.readAt === null;

function CitizenNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/notifications");

        setNotifications(
          Array.isArray(data)
            ? data
            : data.notifications || []
        );
      } catch (err) {
        setError(
          err.message || "Unable to load your notifications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter(isUnread).length,
    [notifications]
  );

  const markAsRead = async (notification) => {
    const notificationId =
      notification.id ||
      notification.notification_id ||
      notification.notificationId;

    if (!notificationId || !isUnread(notification)) {
      return;
    }

    try {
      await apiRequest(`/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      setNotifications((current) =>
        current.map((item) => {
          const itemId =
            item.id ||
            item.notification_id ||
            item.notificationId;

          if (itemId !== notificationId) {
            return item;
          }

          return {
            ...item,
            is_read: true,
            isRead: true,
            read: true,
          };
        })
      );
    } catch (err) {
      console.error("Unable to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications =
      notifications.filter(isUnread);

    if (!unreadNotifications.length) {
      return;
    }

    try {
      setMarkingAll(true);

      await Promise.all(
        unreadNotifications.map((notification) => {
          const notificationId =
            notification.id ||
            notification.notification_id ||
            notification.notificationId;

          if (!notificationId) {
            return Promise.resolve();
          }

          return apiRequest(
            `/notifications/${notificationId}/read`,
            {
              method: "PATCH",
            }
          );
        })
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
          isRead: true,
          read: true,
        }))
      );
    } catch (err) {
      setError(
        err.message || "Some notifications could not be updated."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const renderNotificationContent = (notification) => {
    const NotificationIcon = getNotificationIcon(notification);

    const issueId = getNotificationIssueId(notification);

    const notificationContent = (
      <>
        <div className="notification-icon">
          <NotificationIcon size={18} />
        </div>

        <div className="notification-content">
          <div className="notification-heading">
            <h3>
              {notification.title ||
                notification.subject ||
                "CivicFix update"}
            </h3>

            {isUnread(notification) && (
              <span className="unread-dot" />
            )}
          </div>

          <p>{getNotificationMessage(notification)}</p>

          <div className="notification-meta">
            <span>
              <Clock3 size={12} />
              {formatNotificationTime(
                getNotificationDate(notification)
              )}
            </span>

            {issueId && (
              <span className="notification-report-id">
                Report #{issueId}
              </span>
            )}
          </div>
        </div>

        {issueId && (
          <div className="notification-arrow">
            <ChevronRight size={18} />
          </div>
        )}
      </>
    );

    if (issueId) {
      return (
        <Link
          to={`/citizen/reports/${issueId}`}
          className="notification-link"
          onClick={() => markAsRead(notification)}
        >
          {notificationContent}
        </Link>
      );
    }

    return (
      <button
        type="button"
        className="notification-button"
        onClick={() => markAsRead(notification)}
      >
        {notificationContent}
      </button>
    );
  };

  if (loading) {
    return (
      <main className="notifications-page">
        <div className="notifications-container">
          <div className="notifications-loading">
            <div className="notifications-loading-spinner" />

            <h2>Loading notifications</h2>

            <p>
              We're checking for the latest updates on your reports.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="notifications-page">
      <div className="notifications-container">

        {/* HEADER */}
        <header className="notifications-header">
          <div>
            <div className="notifications-eyebrow">
              <Bell size={14} />
              NOTIFICATION CENTER
            </div>

            <h1>Notifications</h1>

            <p>
              Stay updated with changes and important activity
              related to your civic reports.
            </p>
          </div>

          <div className="notifications-header-actions">
            {unreadCount > 0 && (
              <span className="unread-count">
                {unreadCount} unread
              </span>
            )}

            <button
              type="button"
              className="mark-all-button"
              onClick={markAllAsRead}
              disabled={!unreadCount || markingAll}
            >
              <CheckCheck size={16} />

              {markingAll
                ? "Updating..."
                : "Mark all as read"}
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="notifications-error">
            <XCircle size={18} />

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* NOTIFICATION LIST */}
        {notifications.length > 0 ? (
          <section className="notifications-card">

            <div className="notifications-card-header">
              <div>
                <span className="section-label">
                  RECENT ACTIVITY
                </span>

                <h2>Your updates</h2>
              </div>

              <div className="notification-total">
                {notifications.length}{" "}
                {notifications.length === 1
                  ? "notification"
                  : "notifications"}
              </div>
            </div>

            <div className="notification-list">
              {notifications.map((notification, index) => {
                const notificationId =
                  notification.id ||
                  notification.notification_id ||
                  notification.notificationId ||
                  index;

                return (
                  <article
                    key={notificationId}
                    className={`notification-item ${
                      isUnread(notification)
                        ? "notification-unread"
                        : "notification-read"
                    }`}
                  >
                    {renderNotificationContent(notification)}
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          /* EMPTY STATE */
          <section className="notifications-empty">
            <div className="empty-notification-icon">
              <Bell size={25} />
            </div>

            <span className="section-label">
              ALL CAUGHT UP
            </span>

            <h2>No notifications yet</h2>

            <p>
              When there is an important update on your reports,
              you'll find it here.
            </p>

            <Link
              to="/citizen/reports"
              className="notifications-empty-link"
            >
              <FileText size={16} />
              View my reports
            </Link>
          </section>
        )}

        {/* FOOTER TRUST MESSAGE */}
        <div className="notifications-trust">
          <div className="notifications-trust-icon">
            <ShieldCheck size={17} />
          </div>

          <div>
            <strong>Stay informed</strong>
            <p>
              CivicFix notifications help you follow the progress
              of your reported issues.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

export default CitizenNotifications;