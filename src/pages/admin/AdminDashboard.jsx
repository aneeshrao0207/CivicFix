import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  MapPin,
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

function AdminDashboard() {
  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FETCH ALL ISSUES
  // ============================================

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/issues");

        setIssues(data.issues || []);
      } catch (fetchError) {
        console.error(
          "Failed to fetch admin issues:",
          fetchError
        );

        setError(
          fetchError.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // ============================================
  // DASHBOARD STATISTICS
  // ============================================

  const statistics = useMemo(() => {
    const total = issues.length;

    const reported = issues.filter(
      (issue) => issue.status === "REPORTED"
    ).length;

    const inProgress = issues.filter(
      (issue) =>
        issue.status === "ASSIGNED" ||
        issue.status === "IN_PROGRESS"
    ).length;

    const resolved = issues.filter(
      (issue) => issue.status === "RESOLVED"
    ).length;

    const critical = issues.filter(
      (issue) => issue.priority === "CRITICAL"
    ).length;

    const resolutionRate =
      total > 0
        ? Math.round((resolved / total) * 100)
        : 0;

    return {
      total,
      reported,
      inProgress,
      resolved,
      critical,
      resolutionRate,
    };
  }, [issues]);

  // ============================================
  // CATEGORY DATA
  // ============================================

  const categoryData = useMemo(() => {
    const categoryCounts = {};

    issues.forEach((issue) => {
      const category =
        issue.category || "Other";

      categoryCounts[category] =
        (categoryCounts[category] || 0) + 1;
    });

    return Object.entries(categoryCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [issues]);

  const maxCategoryValue =
    categoryData.length > 0
      ? Math.max(
          ...categoryData.map(
            (item) => item.value
          )
        )
      : 1;

  // ============================================
  // RECENT ISSUES
  // ============================================

  const recentIssues = useMemo(() => {
    return [...issues]
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )
      .slice(0, 5);
  }, [issues]);

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="admin-dashboard-page">

        <div className="admin-dashboard-header">
          <div>
            <div className="admin-dashboard-eyebrow">
              <ShieldAlert size={13} />
              AUTHORITY COMMAND CENTER
            </div>

            <h1>Admin Dashboard</h1>

            <p>
              Loading CivicFix issue data...
            </p>
          </div>
        </div>

        <div className="admin-dashboard-panel">
          <div className="admin-dashboard-loading">
            Loading dashboard...
          </div>
        </div>

      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error) {
    return (
      <div className="admin-dashboard-page">

        <div className="admin-dashboard-header">
          <div>
            <div className="admin-dashboard-eyebrow">
              <ShieldAlert size={13} />
              AUTHORITY COMMAND CENTER
            </div>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor, prioritize and manage civic
              issues across the city.
            </p>
          </div>

          <Link
            to="/admin/issues"
            className="admin-view-all-button"
          >
            View all issues
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-dashboard-panel">
          <div className="admin-dashboard-error">
            <AlertTriangle size={20} />

            <strong>
              Unable to load dashboard
            </strong>

            <span>{error}</span>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">

      {/* ============================================
          HEADER
      ============================================ */}

      <header className="admin-dashboard-header">

        <div>
          <div className="admin-dashboard-eyebrow">
            <ShieldAlert size={13} />
            AUTHORITY COMMAND CENTER
          </div>

          <h1>Admin Dashboard</h1>

          <p>
            Monitor, prioritize and manage civic
            issues across the city.
          </p>
        </div>

        <Link
          to="/admin/issues"
          className="admin-view-all-button"
        >
          View all issues
          <ArrowRight size={14} />
        </Link>

      </header>


      {/* ============================================
          STAT CARDS
      ============================================ */}

      <section className="admin-stat-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <BarChart3 size={17} />
          </div>

          <span>Total issues</span>

          <strong>
            {statistics.total}
          </strong>

          <small>
            All reported issues
          </small>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Clock3 size={17} />
          </div>

          <span>Reported</span>

          <strong>
            {statistics.reported}
          </strong>

          <small>
            Awaiting review
          </small>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <TrendingUp size={17} />
          </div>

          <span>In progress</span>

          <strong>
            {statistics.inProgress}
          </strong>

          <small>
            Currently being handled
          </small>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CheckCircle2 size={17} />
          </div>

          <span>Resolved</span>

          <strong>
            {statistics.resolved}
          </strong>

          <small>
            Successfully completed
          </small>

        </div>


        <div className="admin-stat-card critical-card">

          <div className="admin-stat-icon">
            <AlertTriangle size={17} />
          </div>

          <span>Critical</span>

          <strong>
            {statistics.critical}
          </strong>

          <small>
            Requires attention
          </small>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CheckCircle2 size={17} />
          </div>

          <span>Resolution rate</span>

          <strong>
            {statistics.resolutionRate}%
          </strong>

          <small>
            Overall resolution
          </small>

        </div>

      </section>


      {/* ============================================
          MAIN CONTENT
      ============================================ */}

      <section className="admin-dashboard-grid">

        {/* CATEGORY ANALYTICS */}

        <div className="admin-dashboard-panel">

          <div className="admin-panel-header">

            <div>
              <h2>Issues by category</h2>

              <p>
                Distribution of reported civic
                problems.
              </p>
            </div>

            <BarChart3 size={17} />

          </div>


          <div className="category-chart">

            {categoryData.length === 0 ? (

              <div className="admin-dashboard-empty">
                No category data available.
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

        <div className="admin-dashboard-panel">

          <div className="admin-panel-header">

            <div>
              <h2>Resolution overview</h2>

              <p>
                Current issue distribution.
              </p>
            </div>

            <TrendingUp size={17} />

          </div>


          <div className="resolution-content">

            <div className="resolution-circle">

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
                <span>In Progress</span>
                <strong>
                  {statistics.inProgress}
                </strong>
              </div>

              <div>
                <span className="legend-dot pending" />
                <span>Pending</span>
                <strong>
                  {statistics.reported}
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

        </div>

      </section>


      {/* ============================================
          RECENT ISSUES
      ============================================ */}

      <section className="admin-dashboard-panel recent-panel">

        <div className="admin-panel-header">

          <div>
            <h2>Recent issues</h2>

            <p>
              Latest reports requiring administrative
              attention.
            </p>
          </div>

          <Link to="/admin/issues">
            View all
            <ArrowRight size={13} />
          </Link>

        </div>


        <div className="recent-issues-list">

          {recentIssues.length === 0 ? (

            <div className="admin-dashboard-empty">
              No issues have been reported yet.
            </div>

          ) : (

            recentIssues.map((issue) => {

              const status =
                statusLabels[
                  issue.status
                ] || "Reported";

              const issueIdentifier =
                issue.id;

              return (

                <Link
                  key={issueIdentifier}
                  to={`/admin/issues/${issueIdentifier}`}
                  className="recent-issue-row"
                >

                  <div className="recent-issue-main">

                    <span className="recent-issue-id">
                      {issue.report_id ||
                        `CF-${issue.id}`}
                    </span>

                    <strong>
                      {issue.title ||
                        "Civic issue"}
                    </strong>

                    <span className="recent-issue-category">
                      {issue.category ||
                        "Other"}
                    </span>

                  </div>


                  <div className="recent-issue-right">

                    <span
                      className={`priority-badge ${
                        (
                          issue.priority ||
                          "MEDIUM"
                        ).toLowerCase()
                      }`}
                    >
                      {issue.priority ||
                        "MEDIUM"}
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


                    <ArrowRight size={14} />

                  </div>

                </Link>

              );

            })

          )}

        </div>

      </section>


      {/* ============================================
          MAP
      ============================================ */}

      <section className="admin-dashboard-panel map-panel">

        <div className="admin-panel-header">

          <div>
            <h2>Issue map</h2>

            <p>
              Geographic overview of reported civic
              issues.
            </p>
          </div>

          <Link to="/admin/map">
            Open map
            <ArrowRight size={13} />
          </Link>

        </div>


        <div className="dashboard-map">

          <div className="map-grid-pattern" />

          {issues
            .filter(
              (issue) =>
                issue.latitude &&
                issue.longitude
            )
            .slice(0, 5)
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
                <MapPin size={18} />
              </div>

            ))}


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
              In Progress
            </span>

            <span>
              <i className="map-dot resolved-dot" />
              Resolved
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;