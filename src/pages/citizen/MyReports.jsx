import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./MyReports.css";

const reports = [
  {
    id: "CF-1024",
    title: "Large pothole near Main Road",
    category: "Road",
    location: "Main Road, Bengaluru",
    status: "IN_PROGRESS",
    priority: "HIGH",
    date: "Sep 2, 2026",
  },
  {
    id: "CF-1021",
    title: "Broken streetlight near bus stop",
    category: "Streetlight",
    location: "MG Road, Bengaluru",
    status: "UNDER_REVIEW",
    priority: "MEDIUM",
    date: "Sep 1, 2026",
  },
  {
    id: "CF-1017",
    title: "Garbage overflowing from public bin",
    category: "Garbage",
    location: "Indiranagar, Bengaluru",
    status: "RESOLVED",
    priority: "MEDIUM",
    date: "Aug 29, 2026",
  },
  {
    id: "CF-1012",
    title: "Damaged footpath",
    category: "Public Infrastructure",
    location: "Koramangala, Bengaluru",
    status: "REPORTED",
    priority: "LOW",
    date: "Aug 26, 2026",
  },
];

const statusConfig = {
  REPORTED: {
    label: "Reported",
    className: "reported",
    icon: FileText,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "review",
    icon: Clock3,
  },
  ASSIGNED: {
    label: "Assigned",
    className: "assigned",
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "progress",
    icon: Clock3,
  },
  RESOLVED: {
    label: "Resolved",
    className: "resolved",
    icon: CheckCircle2,
  },
};

function MyReports() {
  return (
    <div className="my-reports-page">

      {/* HEADER */}

      <header className="my-reports-header">

        <div>
          <p className="my-reports-eyebrow">
            CITIZEN PORTAL
          </p>

          <h1>My Reports</h1>

          <p className="my-reports-subtitle">
            Track the civic issues you have reported.
          </p>
        </div>

        <Link
          to="/citizen/report"
          className="new-report-button"
        >
          + Report an issue
        </Link>

      </header>

      {/* SUMMARY */}

      <section className="reports-summary">

        <div className="summary-item">
          <span>Total reports</span>
          <strong>{reports.length}</strong>
        </div>

        <div className="summary-item">
          <span>In progress</span>
          <strong>
            {
              reports.filter(
                (report) =>
                  report.status === "IN_PROGRESS"
              ).length
            }
          </strong>
        </div>

        <div className="summary-item">
          <span>Under review</span>
          <strong>
            {
              reports.filter(
                (report) =>
                  report.status === "UNDER_REVIEW"
              ).length
            }
          </strong>
        </div>

        <div className="summary-item">
          <span>Resolved</span>
          <strong>
            {
              reports.filter(
                (report) =>
                  report.status === "RESOLVED"
              ).length
            }
          </strong>
        </div>

      </section>

      {/* FILTER BAR */}

      <section className="reports-toolbar">

        <div className="reports-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search your reports..."
          />

        </div>

        <button className="filter-button">
          <Filter size={15} />
          Filter
        </button>

      </section>

      {/* REPORT LIST */}

      <section className="reports-list">

        {reports.map((report) => {
          const status = statusConfig[report.status];

          const StatusIcon = status.icon;

          return (
            <Link
              to={`/citizen/reports/${report.id}`}
              className="report-list-card"
              key={report.id}
            >

              <div className="report-card-main">

                <div className="report-status-icon">
                  <StatusIcon size={18} />
                </div>

                <div className="report-card-content">

                  <div className="report-card-top">

                    <span className="report-id">
                      {report.id}
                    </span>

                    <span
                      className={`report-status ${status.className}`}
                    >
                      {status.label}
                    </span>

                  </div>

                  <h2>
                    {report.title}
                  </h2>

                  <div className="report-meta">

                    <span>
                      {report.category}
                    </span>

                    <span>•</span>

                    <span>
                      {report.location}
                    </span>

                    <span>•</span>

                    <span>
                      {report.date}
                    </span>

                  </div>

                </div>

              </div>

              <ChevronRight
                size={18}
                className="report-chevron"
              />

            </Link>
          );
        })}

      </section>

      {/* EMPTY STATE PREPARATION */}

      {reports.length === 0 && (
        <div className="reports-empty">

          <div className="reports-empty-icon">
            <FileText size={23} />
          </div>

          <h2>No reports yet</h2>

          <p>
            When you report a civic issue, it will
            appear here.
          </p>

          <Link to="/citizen/report">
            Report your first issue
          </Link>

        </div>
      )}

    </div>
  );
}

export default MyReports;