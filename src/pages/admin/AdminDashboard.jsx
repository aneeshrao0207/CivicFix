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

import "./AdminDashboard.css";

const recentIssues = [
  {
    id: "CF-1024",
    title: "Large pothole near Main Road",
    category: "Road",
    priority: "HIGH",
    status: "IN_PROGRESS",
  },
  {
    id: "CF-1023",
    title: "Broken streetlight near bus stop",
    category: "Streetlight",
    priority: "MEDIUM",
    status: "UNDER_REVIEW",
  },
  {
    id: "CF-1022",
    title: "Garbage overflow near residential area",
    category: "Garbage",
    priority: "HIGH",
    status: "ASSIGNED",
  },
  {
    id: "CF-1021",
    title: "Water leakage on roadside",
    category: "Water",
    priority: "CRITICAL",
    status: "REPORTED",
  },
];

const categoryData = [
  { name: "Road", value: 42 },
  { name: "Garbage", value: 31 },
  { name: "Streetlight", value: 24 },
  { name: "Water", value: 18 },
  { name: "Traffic", value: 9 },
];

const statusLabels = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

function AdminDashboard() {
  const maxCategoryValue = Math.max(
    ...categoryData.map((item) => item.value)
  );

  return (
    <div className="admin-dashboard-page">

      {/* HEADER */}

      <header className="admin-dashboard-header">

        <div>
          <div className="admin-dashboard-eyebrow">
            <ShieldAlert size={13} />
            AUTHORITY COMMAND CENTER
          </div>

          <h1>Admin Dashboard</h1>

          <p>
            Monitor, prioritize and manage civic issues across the city.
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

      {/* STAT CARDS */}

      <section className="admin-stat-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <BarChart3 size={17} />
          </div>

          <span>Total issues</span>

          <strong>124</strong>

          <small>
            All reported issues
          </small>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Clock3 size={17} />
          </div>

          <span>Reported</span>

          <strong>31</strong>

          <small>
            Awaiting review
          </small>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <TrendingUp size={17} />
          </div>

          <span>In progress</span>

          <strong>42</strong>

          <small>
            Currently being handled
          </small>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CheckCircle2 size={17} />
          </div>

          <span>Resolved</span>

          <strong>27</strong>

          <small>
            Successfully completed
          </small>

        </div>

        <div className="admin-stat-card critical-card">

          <div className="admin-stat-icon">
            <AlertTriangle size={17} />
          </div>

          <span>Critical</span>

          <strong>8</strong>

          <small>
            Requires attention
          </small>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CheckCircle2 size={17} />
          </div>

          <span>Resolution rate</span>

          <strong>72%</strong>

          <small>
            Overall resolution
          </small>

        </div>

      </section>

      {/* MAIN CONTENT */}

      <section className="admin-dashboard-grid">

        {/* CATEGORY ANALYTICS */}

        <div className="admin-dashboard-panel">

          <div className="admin-panel-header">

            <div>
              <h2>Issues by category</h2>

              <p>
                Distribution of reported civic problems.
              </p>
            </div>

            <BarChart3 size={17} />

          </div>

          <div className="category-chart">

            {categoryData.map((category) => (

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
                        (category.value / maxCategoryValue) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  />

                </div>

              </div>

            ))}

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
                <strong>72%</strong>

                <span>
                  Resolved
                </span>
              </div>

            </div>

            <div className="resolution-legend">

              <div>
                <span className="legend-dot resolved" />
                <span>Resolved</span>
                <strong>27</strong>
              </div>

              <div>
                <span className="legend-dot progress" />
                <span>In Progress</span>
                <strong>42</strong>
              </div>

              <div>
                <span className="legend-dot pending" />
                <span>Pending</span>
                <strong>31</strong>
              </div>

              <div>
                <span className="legend-dot critical" />
                <span>Critical</span>
                <strong>8</strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* RECENT ISSUES */}

      <section className="admin-dashboard-panel recent-panel">

        <div className="admin-panel-header">

          <div>
            <h2>Recent issues</h2>

            <p>
              Latest reports requiring administrative attention.
            </p>
          </div>

          <Link to="/admin/issues">
            View all
            <ArrowRight size={13} />
          </Link>

        </div>

        <div className="recent-issues-list">

          {recentIssues.map((issue) => (

            <Link
              key={issue.id}
              to={`/admin/issues/${issue.id}`}
              className="recent-issue-row"
            >

              <div className="recent-issue-main">

                <span className="recent-issue-id">
                  {issue.id}
                </span>

                <strong>
                  {issue.title}
                </strong>

                <span className="recent-issue-category">
                  {issue.category}
                </span>

              </div>

              <div className="recent-issue-right">

                <span
                  className={`priority-badge ${issue.priority.toLowerCase()}`}
                >
                  {issue.priority}
                </span>

                <span
                  className={`status-badge ${issue.status.toLowerCase()}`}
                >
                  {statusLabels[issue.status]}
                </span>

                <ArrowRight size={14} />

              </div>

            </Link>

          ))}

        </div>

      </section>

      {/* MAP */}

      <section className="admin-dashboard-panel map-panel">

        <div className="admin-panel-header">

          <div>
            <h2>Issue map</h2>

            <p>
              Geographic overview of reported civic issues.
            </p>
          </div>

          <Link to="/admin/map">
            Open map
            <ArrowRight size={13} />
          </Link>

        </div>

        <div className="dashboard-map">

          <div className="map-grid-pattern" />

          <div className="map-marker marker-one">
            <MapPin size={18} />
          </div>

          <div className="map-marker marker-two">
            <MapPin size={18} />
          </div>

          <div className="map-marker marker-three">
            <MapPin size={18} />
          </div>

          <div className="map-marker marker-four">
            <MapPin size={18} />
          </div>

          <div className="map-marker marker-five">
            <MapPin size={18} />
          </div>

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