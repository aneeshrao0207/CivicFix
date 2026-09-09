import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileWarning,
  MapPin,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import { apiRequest } from "../../services/api";

import "./AdminDashboard.css";

const statusLabels = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Unknown date";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/issues");

      setIssues(Array.isArray(data.issues) ? data.issues : []);
    } catch (fetchError) {
      console.error("Failed to fetch admin issues:", fetchError);

      setError(
        fetchError.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  /* ============================================
     DASHBOARD STATISTICS
  ============================================ */

  const statistics = useMemo(() => {
    const total = issues.length;

    const reported = issues.filter(
      (issue) => issue.status === "REPORTED"
    ).length;

    const underReview = issues.filter(
      (issue) => issue.status === "UNDER_REVIEW"
    ).length;

    const inProgress = issues.filter(
      (issue) =>
        issue.status === "ASSIGNED" ||
        issue.status === "IN_PROGRESS"
    ).length;

    const resolved = issues.filter(
      (issue) => issue.status === "RESOLVED"
    ).length;

    const rejected = issues.filter(
      (issue) => issue.status === "REJECTED"
    ).length;

    const critical = issues.filter(
      (issue) => issue.priority === "CRITICAL"
    ).length;

    const high = issues.filter(
      (issue) => issue.priority === "HIGH"
    ).length;

    const resolutionRate =
      total > 0
        ? Math.round((resolved / total) * 100)
        : 0;

    return {
      total,
      reported,
      underReview,
      inProgress,
      resolved,
      rejected,
      critical,
      high,
      resolutionRate,
    };
  }, [issues]);

  /* ============================================
     CATEGORY DATA
  ============================================ */

  const categoryData = useMemo(() => {
    const categoryCounts = {};

    issues.forEach((issue) => {
      const category = issue.category || "Other";

      categoryCounts[category] =
        (categoryCounts[category] || 0) + 1;
    });

    return Object.entries(categoryCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [issues]);

  const maxCategoryValue =
    categoryData.length > 0
      ? Math.max(
          ...categoryData.map(
            (item) => item.value
          )
        )
      : 1;

  /* ============================================
     RECENT ISSUES
  ============================================ */

  const recentIssues = useMemo(() => {
    return [...issues]
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )
      .slice(0, 6);
  }, [issues]);

  /* ============================================
     PRIORITY SUMMARY
  ============================================ */

  const priorityData = useMemo(() => {
    return [
      {
        label: "Critical",
        value: statistics.critical,
        className: "critical",
      },
      {
        label: "High",
        value: statistics.high,
        className: "high",
      },
      {
        label: "Medium",
        value: issues.filter(
          (issue) => issue.priority === "MEDIUM"
        ).length,
        className: "medium",
      },
      {
        label: "Low",
        value: issues.filter(
          (issue) => issue.priority === "LOW"
        ).length,
        className: "low",
      },
    ];
  }, [issues, statistics.critical, statistics.high]);

  /* ============================================
     LOADING
  ============================================ */

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-shell">
          <header className="admin-dashboard-header">
            <div>
              <div className="admin-dashboard-eyebrow">
                <ShieldAlert size={14} />
                AUTHORITY COMMAND CENTER
              </div>

              <h1>Admin Dashboard</h1>

              <p>
                Monitor, prioritize and manage civic
                issues across the city.
              </p>
            </div>
          </header>

          <div className="admin-dashboard-loading-panel">
            <div className="admin-loading-spinner">
              <RefreshCw size={20} />
            </div>

            <strong>
              Loading dashboard data
            </strong>

            <span>
              Connecting to CivicFix services...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================
     ERROR
  ============================================ */

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-shell">
          <header className="admin-dashboard-header">
            <div>
              <div className="admin-dashboard-eyebrow">
                <ShieldAlert size={14} />
                AUTHORITY COMMAND CENTER
              </div>

              <h1>Admin Dashboard</h1>

              <p>
                Monitor, prioritize and manage civic
                issues across the city.
              </p>
            </div>

            <button
              type="button"
              className="admin-dashboard-refresh"
              onClick={fetchIssues}
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </header>

          <div className="admin-dashboard-error-panel">
            <div className="admin-error-icon">
              <AlertTriangle size={21} />
            </div>

            <div>
              <strong>
                Unable to load dashboard
              </strong>

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={fetchIssues}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-shell">

        {/* ============================================
            HEADER
        ============================================ */}

        <header className="admin-dashboard-header">
          <div>
            <div className="admin-dashboard-eyebrow">
              <ShieldAlert size={14} />
              AUTHORITY COMMAND CENTER
            </div>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor, prioritize and manage civic
              issues across the city.
            </p>
          </div>

          <div className="admin-dashboard-header-actions">
            <button
              type="button"
              className="admin-dashboard-refresh"
              onClick={fetchIssues}
              title="Refresh dashboard"
            >
              <RefreshCw size={15} />
              Refresh
            </button>

            <Link
              to="/admin/issues"
              className="admin-view-all-button"
            >
              View all issues
              <ArrowRight size={15} />
            </Link>
          </div>
        </header>

        {/* ============================================
            OPERATIONAL SUMMARY
        ============================================ */}

        <div className="admin-dashboard-status-strip">
          <div className="admin-status-indicator">
            <span />
            <strong>System operational</strong>
          </div>

          <div className="admin-status-divider" />

          <span>
            {statistics.total} total issue
            {statistics.total === 1 ? "" : "s"} tracked
          </span>

          <div className="admin-status-divider" />

          <span>
            {statistics.critical} critical requiring
            attention
          </span>
        </div>

        {/* ============================================
            STATISTICS
        ============================================ */}

        <section className="admin-stat-grid">

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon">
                <BarChart3 size={18} />
              </div>

              <span className="admin-stat-label">
                TOTAL ISSUES
              </span>
            </div>

            <strong>{statistics.total}</strong>

            <p>
              All reported civic issues
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon">
                <Clock3 size={18} />
              </div>

              <span className="admin-stat-label">
                PENDING REVIEW
              </span>
            </div>

            <strong>{statistics.reported}</strong>

            <p>
              Awaiting administrative review
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon">
                <TrendingUp size={18} />
              </div>

              <span className="admin-stat-label">
                IN PROGRESS
              </span>
            </div>

            <strong>{statistics.inProgress}</strong>

            <p>
              Currently being handled
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon success">
                <CheckCircle2 size={18} />
              </div>

              <span className="admin-stat-label">
                RESOLVED
              </span>
            </div>

            <strong>{statistics.resolved}</strong>

            <p>
              Successfully completed
            </p>
          </div>

          <div className="admin-stat-card critical">
            <div className="admin-stat-top">
              <div className="admin-stat-icon danger">
                <AlertTriangle size={18} />
              </div>

              <span className="admin-stat-label">
                CRITICAL
              </span>
            </div>

            <strong>{statistics.critical}</strong>

            <p>
              Requires immediate attention
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon success">
                <TrendingUp size={18} />
              </div>

              <span className="admin-stat-label">
                RESOLUTION RATE
              </span>
            </div>

            <strong>
              {statistics.resolutionRate}%
            </strong>

            <p>
              Overall resolution performance
            </p>
          </div>

        </section>

        {/* ============================================
            ANALYTICS GRID
        ============================================ */}

        <section className="admin-dashboard-grid">

          {/* CATEGORY */}

          <div className="admin-dashboard-panel category-panel">

            <div className="admin-panel-header">
              <div>
                <span className="admin-panel-kicker">
                  ISSUE DISTRIBUTION
                </span>

                <h2>Issues by category</h2>

                <p>
                  Most frequently reported civic
                  problems.
                </p>
              </div>

              <div className="admin-panel-header-icon">
                <BarChart3 size={18} />
              </div>
            </div>

            <div className="category-chart">
              {categoryData.length === 0 ? (
                <div className="admin-dashboard-empty">
                  <FileWarning size={22} />

                  <strong>
                    No category data
                  </strong>

                  <span>
                    Category statistics will appear
                    when issues are reported.
                  </span>
                </div>
              ) : (
                categoryData.map((category) => (
                  <div
                    className="category-row"
                    key={category.name}
                  >
                    <div className="category-row-top">
                      <span>
                        {category.name}
                      </span>

                      <strong>
                        {category.value}
                      </strong>
                    </div>

                    <div className="category-bar">
                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${(
                            (category.value /
                              maxCategoryValue) *
                            100
                          ).toFixed(0)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* RESOLUTION */}

          <div className="admin-dashboard-panel resolution-panel">

            <div className="admin-panel-header">
              <div>
                <span className="admin-panel-kicker">
                  PERFORMANCE
                </span>

                <h2>Resolution overview</h2>

                <p>
                  Current issue lifecycle status.
                </p>
              </div>

              <div className="admin-panel-header-icon">
                <TrendingUp size={18} />
              </div>
            </div>

            <div className="resolution-content">

              <div
                className="resolution-circle"
                style={{
                  "--resolution-progress": `${statistics.resolutionRate * 3.6}deg`,
                }}
              >
                <div>
                  <strong>
                    {statistics.resolutionRate}%
                  </strong>

                  <span>
                    Resolved
                  </span>
                </div>
              </div>

              <div className="resolution-legend">

                <div>
                  <span className="legend-dot resolved" />
                  <span>Resolved</span>
                  <strong>
                    {statistics.resolved}
                  </strong>
                </div>

                <div>
                  <span className="legend-dot progress" />
                  <span>In progress</span>
                  <strong>
                    {statistics.inProgress}
                  </strong>
                </div>

                <div>
                  <span className="legend-dot pending" />
                  <span>Pending</span>
                  <strong>
                    {statistics.reported +
                      statistics.underReview}
                  </strong>
                </div>

                <div>
                  <span className="legend-dot critical" />
                  <span>Critical</span>
                  <strong>
                    {statistics.critical}
                  </strong>
                </div>

              </div>
            </div>

            <div className="resolution-footer">
              <span>
                {statistics.resolved} of{" "}
                {statistics.total} issues resolved
              </span>

              <Link to="/admin/issues">
                Manage issues
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>

        </section>

        {/* ============================================
            PRIORITY OVERVIEW
        ============================================ */}

        <section className="admin-dashboard-panel priority-panel">

          <div className="admin-panel-header">
            <div>
              <span className="admin-panel-kicker">
                ATTENTION LEVEL
              </span>

              <h2>Priority overview</h2>

              <p>
                Distribution of issue priority across
                the system.
              </p>
            </div>

            <div className="admin-panel-header-icon">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div className="priority-grid">
            {priorityData.map((item) => (
              <div
                className="priority-item"
                key={item.label}
              >
                <div className="priority-item-heading">
                  <span
                    className={`priority-dot ${item.className}`}
                  />

                  <span>{item.label}</span>

                  <strong>{item.value}</strong>
                </div>

                <div className="priority-track">
                  <div
                    className={`priority-fill ${item.className}`}
                    style={{
                      width:
                        statistics.total > 0
                          ? `${Math.round(
                              (item.value /
                                statistics.total) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ============================================
            RECENT ISSUES
        ============================================ */}

        <section className="admin-dashboard-panel recent-panel">

          <div className="admin-panel-header">
            <div>
              <span className="admin-panel-kicker">
                LATEST ACTIVITY
              </span>

              <h2>Recent issues</h2>

              <p>
                Latest reports requiring
                administrative attention.
              </p>
            </div>

            <Link
              to="/admin/issues"
              className="admin-panel-action"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="recent-issues-list">

            {recentIssues.length === 0 ? (
              <div className="admin-dashboard-empty recent-empty">
                <FileWarning size={23} />

                <strong>
                  No issues reported yet
                </strong>

                <span>
                  New citizen reports will appear
                  here.
                </span>
              </div>
            ) : (
              recentIssues.map((issue) => {
                const status =
                  statusLabels[
                    issue.status
                  ] || "Reported";

                const priority =
                  issue.priority || "MEDIUM";

                return (
                  <Link
                    key={issue.id}
                    to={`/admin/issues/${issue.id}`}
                    className="recent-issue-row"
                  >

                    <div className="recent-issue-main">

                      <div className="recent-issue-marker">
                        <FileWarning size={16} />
                      </div>

                      <div className="recent-issue-copy">

                        <div className="recent-issue-meta">
                          <span className="recent-issue-id">
                            {issue.report_id ||
                              `CF-${issue.id}`}
                          </span>

                          <span>
                            {formatDate(
                              issue.created_at
                            )}
                          </span>
                        </div>

                        <strong>
                          {issue.title ||
                            "Civic issue"}
                        </strong>

                        <span>
                          {issue.category ||
                            "Other"}
                        </span>

                      </div>

                    </div>

                    <div className="recent-issue-right">

                      <span
                        className={`priority-badge ${priority.toLowerCase()}`}
                      >
                        {priority}
                      </span>

                      <span
                        className={`status-badge ${
                          (
                            issue.status ||
                            "REPORTED"
                          ).toLowerCase()
                        }`}
                      >
                        {status}
                      </span>

                      <ArrowRight
                        size={15}
                        className="recent-row-arrow"
                      />

                    </div>

                  </Link>
                );
              })
            )}

          </div>

        </section>

        {/* ============================================
            MAP PREVIEW
        ============================================ */}

        <section className="admin-dashboard-panel map-panel">

          <div className="admin-panel-header">
            <div>
              <span className="admin-panel-kicker">
                GEOGRAPHIC MONITORING
              </span>

              <h2>Issue map</h2>

              <p>
                Geographic overview of reported civic
                issues.
              </p>
            </div>

            <Link
              to="/admin/map"
              className="admin-panel-action"
            >
              Open full map
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="dashboard-map">

            <div className="map-grid-pattern" />

            <div className="map-road map-road-one" />
            <div className="map-road map-road-two" />
            <div className="map-road map-road-three" />

            {issues
              .filter(
                (issue) =>
                  issue.latitude &&
                  issue.longitude
              )
              .slice(0, 6)
              .map((issue, index) => (
                <div
                  key={issue.id}
                  className={`map-marker marker-${
                    index + 1
                  }`}
                  title={
                    issue.title ||
                    "Civic issue"
                  }
                >
                  <MapPin size={17} />
                </div>
              ))}

            {issues.filter(
              (issue) =>
                issue.latitude &&
                issue.longitude
            ).length === 0 && (
              <div className="map-empty-state">
                <MapPin size={22} />

                <strong>
                  No mapped issues yet
                </strong>

                <span>
                  Issue locations will appear here
                  when available.
                </span>
              </div>
            )}

            <div className="dashboard-map-overlay">

              <span>
                <i className="map-dot critical-dot" />
                Critical
              </span>

              <span>
                <i className="map-dot pending-dot" />
                Pending
              </span>

              <span>
                <i className="map-dot progress-dot" />
                In progress
              </span>

              <span>
                <i className="map-dot resolved-dot" />
                Resolved
              </span>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default AdminDashboard;