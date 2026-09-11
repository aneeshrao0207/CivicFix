import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  Image as ImageIcon,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { apiRequest } from "../../services/api";

import "./MyReports.css";

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

  REJECTED: {
    label: "Rejected",
    className: "rejected",
    icon: AlertCircle,
  },
};

const filterOptions = [
  {
    value: "ALL",
    label: "All reports",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "REPORTED",
    label: "Reported",
  },
  {
    value: "IN_PROGRESS",
    label: "In progress",
  },
  {
    value: "RESOLVED",
    label: "Resolved",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
];

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getPriority = (priority) => {
  const normalized = String(priority || "NORMAL").toUpperCase();

  return {
    label:
      normalized.charAt(0) +
      normalized.slice(1).toLowerCase(),

    className: normalized.toLowerCase(),
  };
};

const getStatus = (status) => {
  const normalized = String(status || "REPORTED").toUpperCase();

  return (
    statusConfig[normalized] ||
    statusConfig.REPORTED
  );
};

function MyReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FETCH REPORTS
  // ============================================

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/issues/my");

        setReports(
          Array.isArray(data.issues)
            ? data.issues
            : []
        );
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
    const active = reports.filter((report) => {
      const status = String(
        report.status || ""
      ).toUpperCase();

      return (
        status === "REPORTED" ||
        status === "UNDER_REVIEW" ||
        status === "ASSIGNED" ||
        status === "IN_PROGRESS"
      );
    }).length;

    const resolved = reports.filter(
      (report) =>
        String(report.status || "").toUpperCase() ===
        "RESOLVED"
    ).length;

    const rejected = reports.filter(
      (report) =>
        String(report.status || "").toUpperCase() ===
        "REJECTED"
    ).length;

    return {
      total: reports.length,
      active,
      resolved,
      rejected,
    };
  }, [reports]);

  // ============================================
  // FILTER + SEARCH
  // ============================================

  const filteredReports = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return reports.filter((report) => {
      const status = String(
        report.status || "REPORTED"
      ).toUpperCase();

      let matchesFilter = true;

      if (activeFilter === "ACTIVE") {
        matchesFilter =
          status === "REPORTED" ||
          status === "UNDER_REVIEW" ||
          status === "ASSIGNED" ||
          status === "IN_PROGRESS";
      } else if (
        activeFilter !== "ALL"
      ) {
        matchesFilter = status === activeFilter;
      }

      if (!matchesFilter) {
        return false;
      }

      if (!searchText) {
        return true;
      }

      return (
        report.title
          ?.toLowerCase()
          .includes(searchText) ||
        report.description
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
          .includes(searchText) ||
        report.department_name
          ?.toLowerCase()
          .includes(searchText) ||
        report.id
          ?.toString()
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [
    reports,
    search,
    activeFilter,
  ]);

  // ============================================
  // ACTIVE FILTER LABEL
  // ============================================

  const activeFilterLabel =
    filterOptions.find(
      (option) =>
        option.value === activeFilter
    )?.label || "All reports";

  // ============================================
  // CLEAR SEARCH
  // ============================================

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="my-reports-page">

      {/* =========================================
          HERO
      ========================================= */}

      <header className="my-reports-hero">

        <div className="my-reports-hero-content">

          <span className="reports-eyebrow">
            CIVICFIX · YOUR REPORTS
          </span>

          <h1>
            Track what you've
            <span> reported.</span>
          </h1>

          <p>
            Follow every civic issue from the moment
            you report it to the moment it gets resolved.
          </p>

        </div>

        <Link
          to="/citizen/report"
          className="new-report-button"
        >
          <Plus size={16} />
          Report an issue
        </Link>

      </header>


      {/* =========================================
          OVERVIEW
      ========================================= */}

      <section className="reports-overview">

        <div className="overview-heading">
          <div>
            <span className="overview-kicker">
              OVERVIEW
            </span>

            <h2>
              Your civic activity
            </h2>
          </div>

          {!loading && reports.length > 0 && (
            <span className="reports-count-label">
              {reports.length}{" "}
              {reports.length === 1
                ? "report"
                : "reports"}{" "}
              submitted
            </span>
          )}
        </div>


        <div className="reports-stat-grid">

          {/* TOTAL */}

          <button
            type="button"
            className={`report-stat-card ${
              activeFilter === "ALL"
                ? "stat-card-active"
                : ""
            }`}
            onClick={() =>
              setActiveFilter("ALL")
            }
          >
            <div className="stat-card-top">
              <span className="stat-label">
                Total reports
              </span>

              <span className="stat-icon">
                <FileText size={16} />
              </span>
            </div>

            <strong>
              {loading
                ? "—"
                : statistics.total}
            </strong>

            <span className="stat-description">
              Everything you've reported
            </span>
          </button>


          {/* ACTIVE */}

          <button
            type="button"
            className={`report-stat-card ${
              activeFilter === "ACTIVE"
                ? "stat-card-active"
                : ""
            }`}
            onClick={() =>
              setActiveFilter("ACTIVE")
            }
          >
            <div className="stat-card-top">
              <span className="stat-label">
                Active
              </span>

              <span className="stat-icon">
                <Clock3 size={16} />
              </span>
            </div>

            <strong>
              {loading
                ? "—"
                : statistics.active}
            </strong>

            <span className="stat-description">
              Reports still being handled
            </span>
          </button>


          {/* RESOLVED */}

          <button
            type="button"
            className={`report-stat-card ${
              activeFilter === "RESOLVED"
                ? "stat-card-active"
                : ""
            }`}
            onClick={() =>
              setActiveFilter("RESOLVED")
            }
          >
            <div className="stat-card-top">
              <span className="stat-label">
                Resolved
              </span>

              <span className="stat-icon">
                <CheckCircle2 size={16} />
              </span>
            </div>

            <strong>
              {loading
                ? "—"
                : statistics.resolved}
            </strong>

            <span className="stat-description">
              Issues successfully closed
            </span>
          </button>


          {/* REJECTED */}

          <button
            type="button"
            className={`report-stat-card ${
              activeFilter === "REJECTED"
                ? "stat-card-active"
                : ""
            }`}
            onClick={() =>
              setActiveFilter("REJECTED")
            }
          >
            <div className="stat-card-top">
              <span className="stat-label">
                Rejected
              </span>

              <span className="stat-icon">
                <AlertCircle size={16} />
              </span>
            </div>

            <strong>
              {loading
                ? "—"
                : statistics.rejected}
            </strong>

            <span className="stat-description">
              Reports not accepted for action
            </span>
          </button>

        </div>

      </section>


      {/* =========================================
          TOOLBAR
      ========================================= */}

      <section className="reports-toolbar">

        <div className="reports-toolbar-main">

          <div className="reports-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search reports, locations, categories..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

          </div>


          <div className="filter-summary">

            <Filter size={14} />

            <span>
              Showing:
            </span>

            <strong>
              {activeFilterLabel}
            </strong>

          </div>

        </div>


        {/* STATUS FILTERS */}

        <div className="report-filter-tabs">

          {filterOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={
                activeFilter === option.value
                  ? "filter-tab active"
                  : "filter-tab"
              }
              onClick={() =>
                setActiveFilter(option.value)
              }
            >
              {option.label}
            </button>
          ))}

        </div>

      </section>


      {/* =========================================
          LOADING
      ========================================= */}

      {loading && (
        <div className="reports-state">

          <div className="reports-state-icon">
            <FileText size={22} />
          </div>

          <h2>
            Loading your reports
          </h2>

          <p>
            Fetching the latest information from CivicFix.
          </p>

        </div>
      )}


      {/* =========================================
          ERROR
      ========================================= */}

      {!loading && error && (
        <div className="reports-state reports-state-error">

          <div className="reports-state-icon">
            <AlertCircle size={22} />
          </div>

          <h2>
            Unable to load reports
          </h2>

          <p>
            {error}
          </p>

        </div>
      )}


      {/* =========================================
          REPORT LIST
      ========================================= */}

      {!loading &&
        !error &&
        filteredReports.length > 0 && (

          <section className="reports-results">

            <div className="reports-results-header">

              <div>
                <span className="results-kicker">
                  REPORTS
                </span>

                <h2>
                  {activeFilter === "ALL"
                    ? "All your reports"
                    : activeFilterLabel}
                </h2>
              </div>

              <span className="results-count">
                {filteredReports.length}
              </span>

            </div>


            <div className="reports-list">

              {filteredReports.map((report) => {

                const status = getStatus(
                  report.status
                );

                const StatusIcon =
                  status.icon;

                const priority =
                  getPriority(
                    report.priority
                  );

                const reportId =
                  report.id ||
                  report.issue_id;

                const hasImage =
                  Boolean(
                    report.image_url ||
                    report.imageUrl ||
                    report.image
                  );

                return (

                  <Link
                    to={`/citizen/reports/${reportId}`}
                    className="report-list-card"
                    key={reportId}
                  >

                    {/* LEFT */}

                    <div className="report-card-main">

                      <div
                        className={`report-status-icon ${status.className}`}
                      >
                        <StatusIcon size={18} />
                      </div>


                      <div className="report-card-content">

                        <div className="report-card-top">

                          <span className="report-id">
                            {report.report_id ||
                              `CF-${reportId}`}
                          </span>

                          <span
                            className={`report-status ${status.className}`}
                          >
                            {status.label}
                          </span>

                        </div>


                        <h2>
                          {report.title ||
                            report.description ||
                            "Civic issue"}
                        </h2>


                        <div className="report-meta">

                          <span>
                            {report.category ||
                              "General"}
                          </span>

                          <span className="meta-dot">
                            •
                          </span>

                          <span className="report-location">
                            <MapPin size={11} />
                            {report.address ||
                              "Location unavailable"}
                          </span>

                        </div>


                        <div className="report-card-bottom">

                          <span className="report-date">
                            Reported{" "}
                            {formatDate(
                              report.created_at
                            )}
                          </span>


                          {report.department_name && (
                            <>
                              <span className="meta-dot">
                                •
                              </span>

                              <span className="report-department">
                                {report.department_name}
                              </span>
                            </>
                          )}


                          {hasImage && (
                            <span className="report-photo">
                              <ImageIcon size={11} />
                              Photo attached
                            </span>
                          )}

                        </div>

                      </div>

                    </div>


                    {/* RIGHT */}

                    <div className="report-card-side">

                      <span
                        className={`priority-badge ${priority.className}`}
                      >
                        {priority.label}
                      </span>

                      <div className="report-open-icon">
                        <ArrowUpRight size={17} />
                      </div>

                    </div>

                  </Link>

                );
              })}

            </div>

          </section>
        )}


      {/* =========================================
          EMPTY / NO RESULTS
      ========================================= */}

      {!loading &&
        !error &&
        filteredReports.length === 0 && (

          <div className="reports-empty">

            <div className="reports-empty-icon">
              {search ? (
                <Search size={22} />
              ) : (
                <FileText size={22} />
              )}
            </div>

            <span className="empty-kicker">
              {search
                ? "NO MATCHES"
                : "YOUR REPORTS"}
            </span>

            <h2>
              {search
                ? "No matching reports"
                : activeFilter !== "ALL"
                ? `No ${activeFilterLabel.toLowerCase()}`
                : "No reports yet"}
            </h2>

            <p>
              {search
                ? "Try another search term or clear your search."
                : activeFilter !== "ALL"
                ? "There are no reports in this status right now."
                : "When you report a civic issue, it will appear here so you can track its progress."}
            </p>

            {search ? (
              <button
                type="button"
                className="empty-action"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("ALL");
                }}
              >
                Clear filters
              </button>
            ) : activeFilter !== "ALL" ? (
              <button
                type="button"
                className="empty-action"
                onClick={() =>
                  setActiveFilter("ALL")
                }
              >
                View all reports
              </button>
            ) : (
              <Link
                to="/citizen/report"
                className="empty-action"
              >
                <Plus size={14} />
                Report your first issue
              </Link>
            )}

          </div>
        )}

    </div>
  );
}

export default MyReports;