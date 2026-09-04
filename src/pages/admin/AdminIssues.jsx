import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  ArrowRight,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import { apiRequest } from "../../services/api";

import "./AdminIssues.css";

const statusLabels = {
  ALL: "All statuses",
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

const priorityLabels = {
  ALL: "All priorities",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const categoryLabels = {
  ALL: "All categories",
  Road: "Road",
  Garbage: "Garbage",
  Streetlight: "Streetlight",
  Water: "Water",
  Traffic: "Traffic",
  Infrastructure: "Infrastructure",
  "Public Infrastructure": "Public Infrastructure",
  Other: "Other",
};

function AdminIssues() {
  const [issues, setIssues] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

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
            "Unable to load issues."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);


  // ============================================
  // FILTER ISSUES
  // ============================================

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const reportId =
        issue.report_id?.toLowerCase() || "";

      const title =
        issue.title?.toLowerCase() || "";

      const location =
        issue.address?.toLowerCase() || "";

      const matchesSearch =
        reportId.includes(searchValue) ||
        title.includes(searchValue) ||
        location.includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        issue.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        issue.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "ALL" ||
        issue.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [
    issues,
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);


  // ============================================
  // SUMMARY COUNTS
  // ============================================

  const criticalCount = issues.filter(
    (issue) =>
      issue.priority === "CRITICAL"
  ).length;

  const inProgressCount = issues.filter(
    (issue) =>
      issue.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = issues.filter(
    (issue) =>
      issue.status === "RESOLVED"
  ).length;


  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="admin-issues-page">

        <div className="admin-issues-loading">

          <LoaderCircle
            size={24}
            className="loading-spinner"
          />

          <strong>
            Loading issues...
          </strong>

          <p>
            Fetching civic reports from the database.
          </p>

        </div>

      </div>
    );
  }


  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="admin-issues-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="admin-issues-header">

        <div>

          <div className="admin-issues-eyebrow">

            <Filter size={13} />

            ISSUE MANAGEMENT

          </div>

          <h1>
            All Issues
          </h1>

          <p>
            Review, prioritize and manage civic reports.
          </p>

        </div>


        <div className="issue-count">

          <strong>
            {filteredIssues.length}
          </strong>

          <span>
            {filteredIssues.length === 1
              ? "issue"
              : "issues"}
          </span>

        </div>

      </header>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="admin-issues-error">

          <AlertTriangle size={17} />

          <div>

            <strong>
              Unable to load issues
            </strong>

            <p>
              {error}
            </p>

          </div>

        </div>
      )}


      {/* =====================================
          SUMMARY
      ===================================== */}

      <section className="issue-summary-grid">

        <div className="issue-summary-card">

          <div className="issue-summary-icon">
            <AlertTriangle size={16} />
          </div>

          <div>

            <span>
              Critical
            </span>

            <strong>
              {criticalCount}
            </strong>

          </div>

        </div>


        <div className="issue-summary-card">

          <div className="issue-summary-icon">
            <Clock3 size={16} />
          </div>

          <div>

            <span>
              In progress
            </span>

            <strong>
              {inProgressCount}
            </strong>

          </div>

        </div>


        <div className="issue-summary-card">

          <div className="issue-summary-icon">
            <CheckCircle2 size={16} />
          </div>

          <div>

            <span>
              Resolved
            </span>

            <strong>
              {resolvedCount}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================
          FILTER BAR
      ===================================== */}

      <section className="issue-filter-panel">

        <div className="issue-search">

          <Search size={15} />

          <input
            type="text"
            placeholder="Search by ID, issue or location..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <div className="issue-filter-group">

          {/* STATUS */}

          <div className="issue-select">

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >

              {Object.entries(statusLabels).map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}

            </select>

            <ChevronDown size={13} />

          </div>


          {/* PRIORITY */}

          <div className="issue-select">

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >

              {Object.entries(priorityLabels).map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}

            </select>

            <ChevronDown size={13} />

          </div>


          {/* CATEGORY */}

          <div className="issue-select">

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
            >

              {Object.entries(categoryLabels).map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}

            </select>

            <ChevronDown size={13} />

          </div>

        </div>

      </section>


      {/* =====================================
          ISSUE TABLE
      ===================================== */}

      <section className="issues-table-panel">

        <div className="issues-table-header">

          <span>
            Issue
          </span>

          <span>
            Category
          </span>

          <span>
            Location
          </span>

          <span>
            Priority
          </span>

          <span>
            Status
          </span>

          <span></span>

        </div>


        <div className="issues-table-body">

          {filteredIssues.length === 0 ? (

            <div className="no-issues">

              <Search size={22} />

              <strong>
                {issues.length === 0
                  ? "No issues yet"
                  : "No issues found"}
              </strong>

              <p>
                {issues.length === 0
                  ? "Citizen reports will appear here once submitted."
                  : "Try changing your search or filters."}
              </p>

            </div>

          ) : (

            filteredIssues.map((issue) => (

              <Link
                key={issue.id}
                to={`/admin/issues/${issue.id}`}
                className="issue-table-row"
              >

                {/* ISSUE */}

                <div className="issue-main-cell">

                  <span className="issue-id">
                    {issue.report_id ||
                      `CF-${issue.id}`}
                  </span>

                  <strong>
                    {issue.title}
                  </strong>

                  <small>
                    Reported{" "}
                    {issue.created_at
                      ? new Date(
                          issue.created_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Unknown date"}
                  </small>

                </div>


                {/* CATEGORY */}

                <div className="issue-category-cell">
                  {issue.category || "—"}
                </div>


                {/* LOCATION */}

                <div className="issue-location-cell">

                  <MapPin size={12} />

                  {issue.address ||
                    "Location not provided"}

                </div>


                {/* PRIORITY */}

                <div>

                  <span
                    className={`issue-priority ${
                      issue.priority?.toLowerCase() ||
                      ""
                    }`}
                  >
                    {issue.priority || "NORMAL"}
                  </span>

                </div>


                {/* STATUS */}

                <div>

                  <span
                    className={`issue-status ${
                      issue.status?.toLowerCase() ||
                      ""
                    }`}
                  >
                    {statusLabels[
                      issue.status
                    ] ||
                      issue.status ||
                      "Unknown"}
                  </span>

                </div>


                {/* ARROW */}

                <div className="issue-arrow">

                  <ArrowRight size={14} />

                </div>

              </Link>

            ))

          )}

        </div>

      </section>

    </div>
  );
}

export default AdminIssues;