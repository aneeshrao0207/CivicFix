import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // FETCH ISSUES
  // ============================================

  const fetchIssues = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await apiRequest("/issues");

      setIssues(data.issues || []);
    } catch (fetchError) {
      console.error("Failed to fetch admin issues:", fetchError);

      setError(
        fetchError.message ||
          "Unable to load civic reports. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // ============================================
  // FILTER ISSUES
  // ============================================

  const filteredIssues = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return issues.filter((issue) => {
      const reportId = issue.report_id?.toLowerCase() || "";
      const title = issue.title?.toLowerCase() || "";
      const location = issue.address?.toLowerCase() || "";
      const category = issue.category?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        reportId.includes(searchValue) ||
        title.includes(searchValue) ||
        location.includes(searchValue) ||
        category.includes(searchValue);

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

  const summary = useMemo(() => {
    return {
      critical: issues.filter(
        (issue) => issue.priority === "CRITICAL"
      ).length,

      inProgress: issues.filter(
        (issue) =>
          issue.status === "IN_PROGRESS" ||
          issue.status === "ASSIGNED"
      ).length,

      resolved: issues.filter(
        (issue) => issue.status === "RESOLVED"
      ).length,
    };
  }, [issues]);

  // ============================================
  // ACTIVE FILTERS
  // ============================================

  const hasActiveFilters =
    search.trim() ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    categoryFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCategoryFilter("ALL");
  };

  // ============================================
  // DATE FORMATTER
  // ============================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="admin-issues-page">
        <div className="admin-issues-loading">
          <div className="admin-issues-loading-icon">
            <LoaderCircle
              size={24}
              className="loading-spinner"
            />
          </div>

          <strong>Loading issues</strong>

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
        <div className="admin-issues-heading">
          <div className="admin-issues-eyebrow">
            <Filter size={13} />
            ISSUE MANAGEMENT
          </div>

          <h1>All Issues</h1>

          <p>
            Review, prioritize and manage civic reports
            submitted by citizens.
          </p>
        </div>

        <div className="admin-issues-header-actions">
          <div className="issue-count">
            <strong>{filteredIssues.length}</strong>

            <span>
              {filteredIssues.length === 1
                ? "issue"
                : "issues"}
            </span>
          </div>

          <button
            type="button"
            className="issues-refresh-button"
            onClick={() => fetchIssues(true)}
            disabled={refreshing}
            title="Refresh issues"
          >
            <RefreshCw
              size={15}
              className={
                refreshing ? "refresh-spinning" : ""
              }
            />

            <span>
              {refreshing ? "Refreshing" : "Refresh"}
            </span>
          </button>
        </div>
      </header>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="admin-issues-error">
          <div className="admin-issues-error-icon">
            <AlertTriangle size={17} />
          </div>

          <div className="admin-issues-error-content">
            <strong>Unable to load issues</strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => fetchIssues()}
            className="admin-issues-retry"
          >
            Try again
          </button>
        </div>
      )}

      {/* =====================================
          SUMMARY
      ===================================== */}

      <section className="issue-summary-grid">
        <div className="issue-summary-card">
          <div className="issue-summary-icon critical">
            <AlertTriangle size={16} />
          </div>

          <div>
            <span>Critical priority</span>

            <strong>{summary.critical}</strong>

            <small>
              Requires immediate attention
            </small>
          </div>
        </div>

        <div className="issue-summary-card">
          <div className="issue-summary-icon progress">
            <Clock3 size={16} />
          </div>

          <div>
            <span>Active issues</span>

            <strong>{summary.inProgress}</strong>

            <small>
              Assigned or currently in progress
            </small>
          </div>
        </div>

        <div className="issue-summary-card">
          <div className="issue-summary-icon resolved">
            <CheckCircle2 size={16} />
          </div>

          <div>
            <span>Resolved</span>

            <strong>{summary.resolved}</strong>

            <small>
              Successfully closed reports
            </small>
          </div>
        </div>
      </section>

      {/* =====================================
          FILTER PANEL
      ===================================== */}

      <section className="issue-filter-panel">
        <div className="issue-filter-heading">
          <SlidersHorizontal size={15} />

          <span>Filters</span>
        </div>

        <div className="issue-search">
          <Search size={15} />

          <input
            type="text"
            placeholder="Search by ID, issue, category or location..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="issue-search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
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

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-button"
              onClick={clearFilters}
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </section>

      {/* =====================================
          RESULTS META
      ===================================== */}

      <div className="issues-results-meta">
        <div>
          Showing{" "}
          <strong>{filteredIssues.length}</strong>{" "}
          of <strong>{issues.length}</strong> reports
        </div>

        {hasActiveFilters && (
          <span className="filtered-indicator">
            Filters applied
          </span>
        )}
      </div>

      {/* =====================================
          ISSUE TABLE
      ===================================== */}

      <section className="issues-table-panel">
        <div className="issues-table-header">
          <span>Issue</span>
          <span>Category</span>
          <span>Location</span>
          <span>Priority</span>
          <span>Status</span>
          <span></span>
        </div>

        <div className="issues-table-body">
          {filteredIssues.length === 0 ? (
            <div className="no-issues">
              <div className="no-issues-icon">
                <Search size={21} />
              </div>

              <strong>
                {issues.length === 0
                  ? "No issues yet"
                  : "No matching issues"}
              </strong>

              <p>
                {issues.length === 0
                  ? "Citizen reports will appear here once submitted."
                  : "Try changing your search or filters."}
              </p>

              {issues.length > 0 && hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="no-issues-action"
                >
                  Clear filters
                </button>
              )}
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

                  <strong title={issue.title}>
                    {issue.title || "Untitled issue"}
                  </strong>

                  <small>
                    Reported {formatDate(issue.created_at)}
                  </small>
                </div>

                {/* CATEGORY */}

                <div className="issue-category-cell">
                  {issue.category || "—"}
                </div>

                {/* LOCATION */}

                <div
                  className="issue-location-cell"
                  title={
                    issue.address ||
                    "Location not provided"
                  }
                >
                  <MapPin size={12} />

                  <span>
                    {issue.address ||
                      "Location not provided"}
                  </span>
                </div>

                {/* PRIORITY */}

                <div>
                  <span
                    className={`issue-priority ${
                      issue.priority?.toLowerCase() || ""
                    }`}
                  >
                    {issue.priority || "NORMAL"}
                  </span>
                </div>

                {/* STATUS */}

                <div>
                  <span
                    className={`issue-status ${
                      issue.status?.toLowerCase() || ""
                    }`}
                  >
                    {statusLabels[issue.status] ||
                      issue.status ||
                      "Unknown"}
                  </span>
                </div>

                {/* ARROW */}

                <div className="issue-arrow">
                  <span>View</span>
                  <ChevronDown
                    size={13}
                    className="issue-arrow-icon"
                  />
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