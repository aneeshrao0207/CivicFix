import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
} from "lucide-react";

import { apiRequest } from "../../services/api";

import "./CitizenNotifications.css";

function CitizenNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "status":
        return Clock3;

      case "review":
        return FileText;

      case "resolved":
        return CheckCircle2;

      default:
        return Info;
    }
  };

  const getNotificationType = (notification) => {
    const type = String(
      notification.type ||
        notification.notification_type ||
        "info"
    ).toLowerCase();

    if (type.includes("status")) {
      return "status";
    }

    if (type.includes("review")) {
      return "review";
    }

    if (type.includes("resolv")) {
      return "resolved";
    }

    return "info";
  };

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "Recently";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await apiRequest("/notifications");

      setNotifications(data.notifications || []);
    } catch (loadError) {
      console.error(
        "Notification loading error:",
        loadError
      );

      setError(
        loadError.message ||
          "Unable to load notifications."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await apiRequest(
        `/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
                read: true,
                unread: false,
              }
            : notification
        )
      );
    } catch (readError) {
      console.error(
        "Mark notification as read error:",
        readError
      );

      setError(
        readError.message ||
          "Unable to mark notification as read."
      );
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) =>
        !notification.is_read &&
        !notification.read
    );

    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      setIsMarkingAll(true);
      setError("");

      await Promise.all(
        unreadNotifications.map((notification) =>
          apiRequest(
            `/notifications/${notification.id}/read`,
            {
              method: "PATCH",
            }
          )
        )
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
          read: true,
          unread: false,
        }))
      );
    } catch (readError) {
      console.error(
        "Mark all notifications error:",
        readError
      );

      setError(
        readError.message ||
          "Unable to mark all notifications as read."
      );
    } finally {
      setIsMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.is_read &&
      !notification.read
  ).length;

  return (
    <div className="citizen-notifications-page">

      {/* HEADER */}

      <header className="notifications-header">

        <div>
          <p className="notifications-eyebrow">
            CITIZEN PORTAL
          </p>

          <h1>Notifications</h1>

          <p>
            Stay updated on your reported issues.
          </p>
        </div>

        <button
          className="mark-read-button"
          onClick={markAllAsRead}
          disabled={
            isMarkingAll ||
            unreadCount === 0
          }
        >
          {isMarkingAll
            ? "Marking..."
            : "Mark all as read"}
        </button>

      </header>


      {/* ERROR */}

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}


      {/* LOADING */}

      {isLoading ? (

        <div className="notifications-empty">

          <Bell size={22} />

          <h2>Loading notifications...</h2>

          <p>
            Please wait while we load your updates.
          </p>

        </div>

      ) : (

        <>

          {/* SUMMARY */}

          <div className="notification-summary">

            <div>
              <strong>
                {unreadCount}
              </strong>

              <span>
                Unread notifications
              </span>
            </div>

            <div>
              <strong>
                {notifications.length}
              </strong>

              <span>
                Total notifications
              </span>
            </div>

          </div>


          {/* NOTIFICATIONS */}

          {notifications.length > 0 ? (

            <section className="notifications-list">

              {notifications.map((notification) => {

                const type =
                  getNotificationType(notification);

                const Icon =
                  getNotificationIcon(type);

                const isUnread =
                  !notification.is_read &&
                  !notification.read;

                return (
                  <article
                    className={`notification-card ${
                      isUnread ? "unread" : ""
                    }`}
                    key={notification.id}
                    onClick={() => {
                      if (isUnread) {
                        markAsRead(notification.id);
                      }
                    }}
                  >

                    <div
                      className={`notification-icon ${type}`}
                    >
                      <Icon size={18} />
                    </div>


                    <div className="notification-content">

                      <div className="notification-title-row">

                        <h2>
                          {notification.title ||
                            "CivicFix Update"}
                        </h2>

                        {isUnread && (
                          <span className="unread-dot" />
                        )}

                      </div>


                      <p>
                        {notification.message ||
                          "You have a new update regarding your CivicFix report."}
                      </p>


                      <span className="notification-time">
                        {formatTime(
                          notification.created_at ||
                            notification.createdAt
                        )}
                      </span>

                    </div>

                  </article>
                );
              })}

            </section>

          ) : (

            <div className="notifications-empty">

              <Bell size={22} />

              <h2>No notifications</h2>

              <p>
                Updates about your reports will appear here.
              </p>

            </div>

          )}

        </>

      )}

    </div>
  );
}

export default CitizenNotifications;