import {
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
} from "lucide-react";

import "./CitizenNotifications.css";

const notifications = [
  {
    id: 1,
    type: "status",
    title: "Your report is now in progress",
    message:
      "CF-1024 has been assigned to Road Maintenance and work has started.",
    time: "Today, 12:10 PM",
    unread: true,
    icon: Clock3,
  },
  {
    id: 2,
    type: "review",
    title: "Your report was reviewed",
    message:
      "Your report CF-1021 has been reviewed by the municipal authority.",
    time: "Yesterday, 5:05 PM",
    unread: true,
    icon: FileText,
  },
  {
    id: 3,
    type: "resolved",
    title: "Issue resolved",
    message:
      "The garbage overflow reported in CF-1017 has been resolved.",
    time: "Aug 30, 2026",
    unread: false,
    icon: CheckCircle2,
  },
  {
    id: 4,
    type: "info",
    title: "Welcome to CivicFix",
    message:
      "You can report civic problems and track their resolution from your dashboard.",
    time: "Aug 26, 2026",
    unread: false,
    icon: Info,
  },
];

function CitizenNotifications() {
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

        <button className="mark-read-button">
          Mark all as read
        </button>

      </header>

      {/* SUMMARY */}

      <div className="notification-summary">

        <div>
          <strong>
            {notifications.filter((item) => item.unread).length}
          </strong>

          <span>Unread notifications</span>
        </div>

        <div>
          <strong>{notifications.length}</strong>

          <span>Total notifications</span>
        </div>

      </div>

      {/* NOTIFICATIONS */}

      <section className="notifications-list">

        {notifications.map((notification) => {

          const Icon = notification.icon;

          return (
            <article
              className={`notification-card ${
                notification.unread ? "unread" : ""
              }`}
              key={notification.id}
            >

              <div className={`notification-icon ${notification.type}`}>
                <Icon size={18} />
              </div>

              <div className="notification-content">

                <div className="notification-title-row">

                  <h2>
                    {notification.title}
                  </h2>

                  {notification.unread && (
                    <span className="unread-dot" />
                  )}

                </div>

                <p>
                  {notification.message}
                </p>

                <span className="notification-time">
                  {notification.time}
                </span>

              </div>

            </article>
          );
        })}

      </section>

      {/* EMPTY STATE */}

      {notifications.length === 0 && (
        <div className="notifications-empty">

          <Bell size={22} />

          <h2>No notifications</h2>

          <p>
            Updates about your reports will appear here.
          </p>

        </div>
      )}

    </div>
  );
}

export default CitizenNotifications;