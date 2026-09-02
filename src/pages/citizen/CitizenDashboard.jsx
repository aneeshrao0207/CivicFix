import {
  Bell,
  ChevronDown,
  ClipboardList,
  FilePlus2,
  Home,
  LogOut,
  MapPin,
  Menu,
  Plus,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./CitizenDashboard.css";

function CitizenDashboard() {
  const reports = [
    {
      id: "CF-1024",
      title: "Large pothole near Main Road",
      category: "Road",
      location: "Main Road",
      date: "Sep 2, 2026",
      status: "In Progress",
    },
    {
      id: "CF-1023",
      title: "Broken streetlight near bus stop",
      category: "Streetlight",
      location: "MG Road",
      date: "Sep 1, 2026",
      status: "Under Review",
    },
    {
      id: "CF-1022",
      title: "Garbage overflow near residential area",
      category: "Garbage",
      location: "Indiranagar",
      date: "Aug 29, 2026",
      status: "Resolved",
    },
  ];

  return (
    <div className="citizen-dashboard">

      {/* ==============================
          SIDEBAR
      ============================== */}

      <aside className="citizen-sidebar">

        <Link to="/" className="dashboard-logo">
          <span className="dashboard-logo-mark">
            C
          </span>

          <span>CivicFix</span>
        </Link>

        <nav className="dashboard-nav">

          <p className="dashboard-nav-label">
            Workspace
          </p>

          <Link
            to="/citizen/dashboard"
            className="dashboard-nav-item active"
          >
            <Home size={18} />
            Dashboard
          </Link>

          <Link
            to="/citizen/reports"
            className="dashboard-nav-item"
          >
            <ClipboardList size={18} />
            My Reports
          </Link>

          <Link
            to="/citizen/report"
            className="dashboard-nav-item"
          >
            <FilePlus2 size={18} />
            Report an Issue
          </Link>

        </nav>

        <div className="dashboard-sidebar-bottom">

          <div className="dashboard-help">
            <div className="dashboard-help-icon">
              ?
            </div>

            <div>
              <strong>Need help?</strong>
              <span>Contact CivicFix support</span>
            </div>
          </div>

          <button className="dashboard-logout">
            <LogOut size={17} />
            Sign out
          </button>

        </div>

      </aside>

      {/* ==============================
          MAIN AREA
      ============================== */}

      <main className="citizen-main">

        {/* TOPBAR */}

        <header className="citizen-topbar">

          <button className="mobile-menu">
            <Menu size={21} />
          </button>

          <div className="topbar-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search your reports..."
            />
          </div>

          <div className="topbar-actions">

            <button className="notification-button">
              <Bell size={19} />

              <span className="notification-dot"></span>
            </button>

            <div className="user-menu">

              <div className="user-avatar">
                A
              </div>

              <div className="user-info">
                <strong>Aneesh</strong>
                <span>Citizen</span>
              </div>

              <ChevronDown size={16} />

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="citizen-content">

          {/* HERO */}

          <section className="dashboard-welcome">

            <div>
              <p className="dashboard-eyebrow">
                CITIZEN DASHBOARD
              </p>

              <h1>
                Good morning, Aneesh
                <span>👋</span>
              </h1>

              <p className="dashboard-subtitle">
                Keep your community moving forward.
                Report problems and follow their progress.
              </p>
            </div>

            <Link
              to="/citizen/report"
              className="report-button"
            >
              <Plus size={18} />
              Report an issue
            </Link>

          </section>

          {/* STATISTICS */}

          <section className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon">
                <ClipboardList size={19} />
              </div>

              <div>
                <span>Total reports</span>
                <strong>6</strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <FilePlus2 size={19} />
              </div>

              <div>
                <span>Pending</span>
                <strong>2</strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <MapPin size={19} />
              </div>

              <div>
                <span>In progress</span>
                <strong>3</strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ✓
              </div>

              <div>
                <span>Resolved</span>
                <strong>1</strong>
              </div>

            </div>

          </section>

          {/* REPORTS */}

          <section className="reports-section">

            <div className="section-heading">

              <div>
                <h2>Recent reports</h2>

                <p>
                  Track the civic issues you've reported.
                </p>
              </div>

              <Link to="/citizen/reports">
                View all
                <span>→</span>
              </Link>

            </div>

            <div className="reports-table">

              <div className="reports-table-header">
                <span>Report</span>
                <span>Category</span>
                <span>Location</span>
                <span>Date</span>
                <span>Status</span>
              </div>

              {reports.map((report) => (

                <Link
                  to={`/citizen/reports/${report.id}`}
                  className="report-row"
                  key={report.id}
                >

                  <div className="report-title">

                    <strong>
                      {report.title}
                    </strong>

                    <span>
                      #{report.id}
                    </span>

                  </div>

                  <span className="report-category">
                    {report.category}
                  </span>

                  <span className="report-location">
                    <MapPin size={14} />
                    {report.location}
                  </span>

                  <span className="report-date">
                    {report.date}
                  </span>

                  <span
                    className={`status-badge ${report.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    <span></span>
                    {report.status}
                  </span>

                </Link>

              ))}

            </div>

          </section>

          {/* EMPTY/INFO CARD */}

          <section className="dashboard-info">

            <div className="dashboard-info-icon">
              ✓
            </div>

            <div>

              <strong>
                Every report helps improve your community.
              </strong>

              <p>
                See something that needs attention?
                Report it and let the right people know.
              </p>

            </div>

            <Link to="/citizen/report">
              Report an issue →
            </Link>

          </section>

        </div>

      </main>

    </div>
  );
}

export default CitizenDashboard;