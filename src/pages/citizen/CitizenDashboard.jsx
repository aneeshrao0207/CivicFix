import { useEffect, useMemo, useState } from "react";

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
  UserRound,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../../services/api";

import "./CitizenDashboard.css";

const statusLabels = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

function CitizenDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);

  // ============================================
  // GET LOGGED-IN USER
  // ============================================

  const storedUser = localStorage.getItem("civicfix_user");

  let currentUser = null;

  try {
    currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    currentUser = null;
  }

  const userName = currentUser?.name || "Citizen";

  // ============================================
  // FETCH CITIZEN REPORTS
  // ============================================

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/issues/my");

        setReports(data.issues || []);
      } catch (fetchError) {
        console.error(
          "Failed to fetch citizen reports:",
          fetchError
        );

        setError(
          fetchError.message ||
            "Unable to load your reports."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // ============================================
  // STATISTICS
  // ============================================

  const statistics = useMemo(() => {
    return {
      total: reports.length,

      pending: reports.filter(
        (report) =>
          report.status === "REPORTED" ||
          report.status === "UNDER_REVIEW"
      ).length,

      inProgress: reports.filter(
        (report) =>
          report.status === "ASSIGNED" ||
          report.status === "IN_PROGRESS"
      ).length,

      resolved: reports.filter(
        (report) =>
          report.status === "RESOLVED"
      ).length,
    };
  }, [reports]);

  // ============================================
  // RECENT REPORTS + SEARCH
  // ============================================

  const recentReports = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const filtered = reports.filter((report) => {
      if (!searchText) return true;

      return (
        report.title
          ?.toLowerCase()
          .includes(searchText) ||

        report.category
          ?.toLowerCase()
          .includes(searchText) ||

        report.address
          ?.toLowerCase()
          .includes(searchText) ||

        report.report_id
          ?.toLowerCase()
          .includes(searchText)
      );
    });

    return filtered.slice(0, 5);
  }, [reports, search]);

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem("civicfix_token");
    localStorage.removeItem("civicfix_user");

    navigate("/citizen/login", {
      replace: true,
    });
  };

  // ============================================
  // CLOSE PROFILE MENU
  // ============================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(
          ".user-menu-wrapper"
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="citizen-dashboard">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="citizen-sidebar">

        <Link
          to="/"
          className="dashboard-logo"
        >
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
              <strong>
                Need help?
              </strong>

              <span>
                Contact CivicFix support
              </span>
            </div>

          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>

        </div>

      </aside>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="citizen-main">

        {/* =====================================
            TOPBAR
        ===================================== */}

        <header className="citizen-topbar">

          <button
            className="mobile-menu"
            type="button"
          >
            <Menu size={21} />
          </button>

          <div className="topbar-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search your reports..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <div className="topbar-actions">

            {/* NOTIFICATIONS */}

            <button
              className="notification-button"
              type="button"
              onClick={() =>
                navigate(
                  "/citizen/notifications"
                )
              }
            >
              <Bell size={19} />

              <span className="notification-dot" />
            </button>

            {/* PROFILE */}

            <div className="user-menu-wrapper">

              <button
                type="button"
                className={`user-menu ${
                  profileOpen
                    ? "open"
                    : ""
                }`}
                onClick={(event) => {
                  event.stopPropagation();

                  setProfileOpen(
                    (current) =>
                      !current
                  );
                }}
              >

                <div className="user-avatar">
                  {userName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="user-info">

                  <strong>
                    {userName}
                  </strong>

                  <span>
                    Citizen
                  </span>

                </div>

                <ChevronDown
                  size={16}
                  className={
                    profileOpen
                      ? "profile-chevron-open"
                      : ""
                  }
                />

              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (

                <div className="profile-dropdown">

                  <Link
                    to="/citizen/profile"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    <UserRound size={16} />

                    <span>
                      My Profile
                    </span>
                  </Link>

                  <Link
                    to="/citizen/notifications"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    <Bell size={16} />

                    <span>
                      Notifications
                    </span>
                  </Link>

                  <div className="profile-dropdown-divider" />

                  <button
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />

                    <span>
                      Sign out
                    </span>
                  </button>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="citizen-content">

          {/* ===================================
              HERO
          =================================== */}

          <section className="dashboard-welcome">

            <div>

              <p className="dashboard-eyebrow">
                CITIZEN DASHBOARD
              </p>

              <h1>
                Good morning, {userName}
                <span>👋</span>
              </h1>

              <p className="dashboard-subtitle">
                Keep your community moving
                forward. Report problems and
                follow their progress.
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

          {/* ===================================
              STATISTICS
          =================================== */}

          <section className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon">
                <ClipboardList size={19} />
              </div>

              <div>
                <span>
                  Total reports
                </span>

                <strong>
                  {loading
                    ? "—"
                    : statistics.total}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <FilePlus2 size={19} />
              </div>

              <div>
                <span>
                  Pending
                </span>

                <strong>
                  {loading
                    ? "—"
                    : statistics.pending}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <MapPin size={19} />
              </div>

              <div>
                <span>
                  In progress
                </span>

                <strong>
                  {loading
                    ? "—"
                    : statistics.inProgress}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ✓
              </div>

              <div>
                <span>
                  Resolved
                </span>

                <strong>
                  {loading
                    ? "—"
                    : statistics.resolved}
                </strong>
              </div>

            </div>

          </section>

          {/* ===================================
              REPORTS
          =================================== */}

          <section className="reports-section">

            <div className="section-heading">

              <div>

                <h2>
                  Recent reports
                </h2>

                <p>
                  Track the civic issues
                  you've reported.
                </p>

              </div>

              <Link
                to="/citizen/reports"
              >
                View all
                <span>→</span>
              </Link>

            </div>

            {/* ERROR */}

            {error && (

              <div className="dashboard-report-message">

                <strong>
                  Unable to load reports
                </strong>

                <span>
                  {error}
                </span>

              </div>

            )}

            {/* LOADING */}

            {loading && !error && (

              <div className="dashboard-report-message">

                <strong>
                  Loading reports...
                </strong>

                <span>
                  Fetching your latest
                  CivicFix reports.
                </span>

              </div>

            )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              recentReports.length === 0 && (

                <div className="dashboard-report-message">

                  <strong>
                    No reports yet
                  </strong>

                  <span>
                    Report your first civic
                    issue to get started.
                  </span>

                  <Link
                    to="/citizen/report"
                  >
                    Report an issue →
                  </Link>

                </div>

              )}

            {/* REPORT TABLE */}

            {!loading &&
              !error &&
              recentReports.length > 0 && (

                <div className="reports-table">

                  <div className="reports-table-header">

                    <span>
                      Report
                    </span>

                    <span>
                      Category
                    </span>

                    <span>
                      Location
                    </span>

                    <span>
                      Date
                    </span>

                    <span>
                      Status
                    </span>

                  </div>

                  {recentReports.map(
                    (report) => {

                      const reportId =
                        report.id ||
                        report.issue_id;

                      const status =
                        statusLabels[
                          report.status
                        ] ||
                        "Reported";

                      return (

                        <Link
                          to={`/citizen/reports/${reportId}`}
                          className="report-row"
                          key={reportId}
                        >

                          <div className="report-title">

                            <strong>
                              {report.title ||
                                "Civic issue"}
                            </strong>

                            <span>
                              #
                              {report.report_id ||
                                `CF-${reportId}`}
                            </span>

                          </div>

                          <span className="report-category">
                            {report.category ||
                              "General"}
                          </span>

                          <span className="report-location">

                            <MapPin size={14} />

                            {report.address ||
                              "Location unavailable"}

                          </span>

                          <span className="report-date">

                            {report.created_at
                              ? new Date(
                                  report.created_at
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}

                          </span>

                          <span
                            className={`status-badge ${
                              report.status
                                ?.toLowerCase()
                                .replaceAll(
                                  "_",
                                  "-"
                                ) ||
                              "reported"
                            }`}
                          >

                            <span />

                            {status}

                          </span>

                        </Link>

                      );
                    }
                  )}

                </div>

              )}

          </section>

          {/* ===================================
              INFO CARD
          =================================== */}

          <section className="dashboard-info">

            <div className="dashboard-info-icon">
              ✓
            </div>

            <div>

              <strong>
                Every report helps improve
                your community.
              </strong>

              <p>
                See something that needs
                attention? Report it and let
                the right people know.
              </p>

            </div>

            <Link
              to="/citizen/report"
            >
              Report an issue →
            </Link>

          </section>

        </div>

      </main>

    </div>
  );
}

export default CitizenDashboard;