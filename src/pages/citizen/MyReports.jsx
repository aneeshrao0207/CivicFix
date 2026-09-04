import { useEffect, useState } from "react";
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
};

function MyReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/issues/my");

        setReports(data.issues || data || []);
      } catch (fetchError) {
        console.error("Failed to fetch reports:", fetchError);

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

  const filteredReports = reports.filter((report) => {
    const searchText = search.toLowerCase();

    return (
      report.title?.toLowerCase().includes(searchText) ||
      report.category?.toLowerCase().includes(searchText) ||
      report.location?.toLowerCase().includes(searchText) ||
      report.id?.toString().toLowerCase().includes(searchText)
    );
  });

  const inProgressCount = reports.filter(
    (report) => report.status === "IN_PROGRESS"
  ).length;

  const underReviewCount = reports.filter(
    (report) => report.status === "UNDER_REVIEW"
  ).length;

  const resolvedCount = reports.filter(
    (report) => report.status === "RESOLVED"
  ).length;

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
          <strong>{inProgressCount}</strong>
        </div>

        <div className="summary-item">
          <span>Under review</span>
          <strong>{underReviewCount}</strong>
        </div>

        <div className="summary-item">
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
        </div>

      </section>


      {/* FILTER BAR */}

      <section className="reports-toolbar">

        <div className="reports-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search your reports..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <button
          type="button"
          className="filter-button"
        >
          <Filter size={15} />
          Filter
        </button>

      </section>


      {/* LOADING */}

      {loading && (
        <div className="reports-empty">

          <div className="reports-empty-icon">
            <FileText size={23} />
          </div>

          <h2>Loading reports...</h2>

          <p>
            Fetching your reports from CivicFix.
          </p>

        </div>
      )}


      {/* ERROR */}

      {!loading && error && (
        <div className="reports-empty">

          <div className="reports-empty-icon">
            <AlertCircle size={23} />
          </div>

          <h2>Unable to load reports</h2>

          <p>{error}</p>

        </div>
      )}


      {/* REPORT LIST */}

      {!loading && !error && filteredReports.length > 0 && (
        <section className="reports-list">

          {filteredReports.map((report) => {

            const status =
              statusConfig[report.status] ||
              statusConfig.REPORTED;

            const StatusIcon = status.icon;

            const reportId =
              report.id || report.issue_id;

            return (
              <Link
                to={`/citizen/reports/${reportId}`}
                className="report-list-card"
                key={reportId}
              >

                <div className="report-card-main">

                  <div className="report-status-icon">
                    <StatusIcon size={18} />
                  </div>

                  <div className="report-card-content">

                    <div className="report-card-top">

                      <span className="report-id">
                        {report.reference_id ||
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

                      <span>•</span>

                      <span>
                        {report.location ||
                          report.address ||
                          "Location unavailable"}
                      </span>

                      <span>•</span>

                      <span>
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
                          : "Date unavailable"}
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
      )}


      {/* EMPTY STATE */}

      {!loading &&
        !error &&
        filteredReports.length === 0 && (
          <div className="reports-empty">

            <div className="reports-empty-icon">
              <FileText size={23} />
            </div>

            <h2>
              {search
                ? "No matching reports"
                : "No reports yet"}
            </h2>

            <p>
              {search
                ? "Try a different search term."
                : "When you report a civic issue, it will appear here."}
            </p>

            {!search && (
              <Link to="/citizen/report">
                Report your first issue
              </Link>
            )}

          </div>
        )}

    </div>
  );
}

export default MyReports;