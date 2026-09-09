import { useEffect, useMemo, useState } from "react";

import {
  ClipboardList,
  FilePlus2,
  MapPin,
  Plus,
  Search,
  X,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";

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
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // GET LOGGED-IN USER
  // ============================================

  const storedUser = localStorage.getItem("civicfix_user");

  let currentUser = null;

  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    currentUser = null;
  }

  const userName = currentUser?.name || "Citizen";

  // ============================================
  // FETCH CITIZEN REPORTS
  // ============================================

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

      setReports([]);

      const errorMessage =
        fetchError?.message?.toLowerCase().includes("failed to fetch")
          ? "Unable to connect to CivicFix. Please check your connection and try again."
          : fetchError?.message ||
            "Unable to load your reports.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  return (
    <div className="citizen-dashboard">

      {/* =========================================
          DASHBOARD CONTENT
      ========================================= */}

      <div className="citizen-dashboard-content">

        {/* ===================================
            WELCOME
        =================================== */}

        <section className="dashboard-welcome">

          <div className="welcome-copy">

            <div className="dashboard-eyebrow">
              CITIZEN DASHBOARD
            </div>

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

            <span>
              Report an issue
            </span>

            <ArrowUpRight
              size={16}
              className="report-button-arrow"
            />
          </Link>

        </section>


        {/* ===================================
            API ERROR BANNER
        =================================== */}

        {error && !loading && (
          <section className="dashboard-api-error">

            <div className="dashboard-api-error-icon">
              <AlertCircle size={20} />
            </div>

            <div className="dashboard-api-error-content">

              <strong>
                Unable to connect to CivicFix
              </strong>

              <span>
                {error}
              </span>

            </div>

            <button
              type="button"
              className="dashboard-api-retry"
              onClick={fetchReports}
            >
              <RefreshCw size={15} />
              Retry
            </button>

          </section>
        )}


        {/* ===================================
            STATISTICS
        =================================== */}

        <section className="dashboard-stats">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon total">
                <ClipboardList size={19} />
              </div>

              <span className="stat-label">
                Total reports
              </span>

            </div>

            <strong className="stat-value">
              {loading || error
                ? "—"
                : statistics.total}
            </strong>

            <span className="stat-description">
              {error
                ? "Data unavailable"
                : "All issues you've reported"}
            </span>

          </div>


          {/* PENDING */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon pending">
                <Clock3 size={19} />
              </div>

              <span className="stat-label">
                Pending
              </span>

            </div>

            <strong className="stat-value">
              {loading || error
                ? "—"
                : statistics.pending}
            </strong>

            <span className="stat-description">
              {error
                ? "Data unavailable"
                : "Waiting for action"}
            </span>

          </div>


          {/* IN PROGRESS */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon progress">
                <MapPin size={19} />
              </div>

              <span className="stat-label">
                In progress
              </span>

            </div>

            <strong className="stat-value">
              {loading || error
                ? "—"
                : statistics.inProgress}
            </strong>

            <span className="stat-description">
              {error
                ? "Data unavailable"
                : "Currently being handled"}
            </span>

          </div>


          {/* RESOLVED */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon resolved">
                <CheckCircle2 size={19} />
              </div>

              <span className="stat-label">
                Resolved
              </span>

            </div>

            <strong className="stat-value">
              {loading || error
                ? "—"
                : statistics.resolved}
            </strong>

            <span className="stat-description">
              {error
                ? "Data unavailable"
                : "Successfully completed"}
            </span>

          </div>

        </section>


        {/* ===================================
            REPORTS
        =================================== */}

        <section className="reports-section">

          <div className="section-heading">

            <div>

              <div className="section-kicker">
                ACTIVITY
              </div>

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
              className="view-all-link"
            >
              View all

              <ArrowUpRight size={15} />
            </Link>

          </div>


          {/* ===================================
              SEARCH
          =================================== */}

          <div className="dashboard-report-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search your reports..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

          </div>


          {/* ===================================
              ERROR
          =================================== */}

          {error && (
            <div className="dashboard-report-message error-state">

              <div className="message-icon">
                <AlertCircle size={19} />
              </div>

              <strong>
                Unable to load reports
              </strong>

              <span>
                {error}
              </span>

              <button
                type="button"
                className="dashboard-inline-retry"
                onClick={fetchReports}
              >
                <RefreshCw size={14} />
                Try again
              </button>

            </div>
          )}


          {/* ===================================
              LOADING
          =================================== */}

          {loading && !error && (
            <div className="reports-table reports-loading">

              <div className="reports-table-header">

                <span>Report</span>
                <span>Category</span>
                <span>Location</span>
                <span>Date</span>
                <span>Status</span>

              </div>

              {[1, 2, 3].map((item) => (
                <div
                  className="report-skeleton-row"
                  key={item}
                >

                  <div className="skeleton-report">

                    <span />

                    <div>
                      <i />
                      <i />
                    </div>

                  </div>

                  <i />

                  <i />

                  <i />

                  <i className="skeleton-status" />

                </div>
              ))}

            </div>
          )}


          {/* ===================================
              EMPTY
          =================================== */}

          {!loading &&
            !error &&
            recentReports.length === 0 && (
              <div className="dashboard-report-message empty-state">

                <div className="message-icon">
                  <ClipboardList size={19} />
                </div>

                <strong>
                  No reports yet
                </strong>

                <span>
                  {search
                    ? "No reports match your search."
                    : "Report your first civic issue to get started."}
                </span>

                {!search && (
                  <Link to="/citizen/report">
                    Report an issue
                    <ArrowUpRight size={14} />
                  </Link>
                )}

              </div>
            )}


          {/* ===================================
              REPORT TABLE
          =================================== */}

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

                    const statusClass =
                      report.status
                        ?.toLowerCase()
                        .replaceAll(
                          "_",
                          "-"
                        ) ||
                      "reported";

                    return (
                      <Link
                        to={`/citizen/reports/${reportId}`}
                        className="report-row"
                        key={reportId}
                      >

                        {/* REPORT */}

                        <div className="report-title">

                          <div className="report-title-icon">
                            <FilePlus2 size={15} />
                          </div>

                          <div>

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

                        </div>


                        {/* CATEGORY */}

                        <span className="report-category">
                          {report.category ||
                            "General"}
                        </span>


                        {/* LOCATION */}

                        <span className="report-location">

                          <MapPin size={14} />

                          <span>
                            {report.address ||
                              "Location unavailable"}
                          </span>

                        </span>


                        {/* DATE */}

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


                        {/* STATUS */}

                        <span
                          className={`status-badge ${statusClass}`}
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
            <CheckCircle2 size={18} />
          </div>

          <div className="dashboard-info-content">

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
            className="dashboard-info-link"
          >
            Report an issue

            <ArrowUpRight size={15} />
          </Link>

        </section>

      </div>

    </div>
  );
}

export default CitizenDashboard;