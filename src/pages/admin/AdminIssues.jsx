import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  ArrowRight,
  AlertTriangle,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./AdminIssues.css";

const issues = [
  {
    id: "CF-1024",
    title: "Large pothole near Main Road",
    category: "Road",
    location: "Main Road",
    department: "Road Maintenance",
    priority: "HIGH",
    status: "IN_PROGRESS",
    reported: "Sep 2, 2026",
  },
  {
    id: "CF-1023",
    title: "Broken streetlight near bus stop",
    category: "Streetlight",
    location: "MG Road",
    department: "Electrical",
    priority: "MEDIUM",
    status: "UNDER_REVIEW",
    reported: "Sep 2, 2026",
  },
  {
    id: "CF-1022",
    title: "Garbage overflow near residential area",
    category: "Garbage",
    location: "Indiranagar",
    department: "Waste Management",
    priority: "HIGH",
    status: "ASSIGNED",
    reported: "Sep 1, 2026",
  },
  {
    id: "CF-1021",
    title: "Water leakage on roadside",
    category: "Water",
    location: "Whitefield",
    department: "Water Supply",
    priority: "CRITICAL",
    status: "REPORTED",
    reported: "Sep 1, 2026",
  },
  {
    id: "CF-1020",
    title: "Damaged footpath",
    category: "Infrastructure",
    location: "Koramangala",
    department: "Road Maintenance",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    reported: "Aug 31, 2026",
  },
  {
    id: "CF-1019",
    title: "Traffic signal not working",
    category: "Traffic",
    location: "Silk Board",
    department: "Traffic Department",
    priority: "CRITICAL",
    status: "RESOLVED",
    reported: "Aug 30, 2026",
  },
  {
    id: "CF-1018",
    title: "Overflowing public dustbin",
    category: "Garbage",
    location: "HSR Layout",
    department: "Waste Management",
    priority: "LOW",
    status: "RESOLVED",
    reported: "Aug 29, 2026",
  },
];

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
};

function AdminIssues() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        issue.id.toLowerCase().includes(searchValue) ||
        issue.title.toLowerCase().includes(searchValue) ||
        issue.location.toLowerCase().includes(searchValue);

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
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  return (
    <div className="admin-issues-page">

      {/* HEADER */}

      <header className="admin-issues-header">

        <div>
          <div className="admin-issues-eyebrow">
            <Filter size={13} />
            ISSUE MANAGEMENT
          </div>

          <h1>All Issues</h1>

          <p>
            Review, prioritize and manage civic reports.
          </p>
        </div>

        <div className="issue-count">
          <strong>{filteredIssues.length}</strong>
          <span>
            {filteredIssues.length === 1
              ? "issue"
              : "issues"}
          </span>
        </div>

      </header>

      {/* SUMMARY */}

      <section className="issue-summary-grid">

        <div className="issue-summary-card">

          <div className="issue-summary-icon">
            <AlertTriangle size={16} />
          </div>

          <div>
            <span>Critical</span>
            <strong>
              {
                issues.filter(
                  (issue) =>
                    issue.priority === "CRITICAL"
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="issue-summary-card">

          <div className="issue-summary-icon">
            <Clock3 size={16} />
          </div>

          <div>
            <span>In progress</span>
            <strong>
              {
                issues.filter(
                  (issue) =>
                    issue.status === "IN_PROGRESS"
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="issue-summary-card">

          <div className="issue-summary-icon">
            <CheckCircle2 size={16} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>
              {
                issues.filter(
                  (issue) =>
                    issue.status === "RESOLVED"
                ).length
              }
            </strong>
          </div>

        </div>

      </section>

      {/* FILTER BAR */}

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

      {/* ISSUE TABLE */}

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

              <Search size={22} />

              <strong>
                No issues found
              </strong>

              <p>
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            filteredIssues.map((issue) => (

              <Link
                key={issue.id}
                to={`/admin/issues/${issue.id}`}
                className="issue-table-row"
              >

                <div className="issue-main-cell">

                  <span className="issue-id">
                    {issue.id}
                  </span>

                  <strong>
                    {issue.title}
                  </strong>

                  <small>
                    Reported {issue.reported}
                  </small>

                </div>

                <div className="issue-category-cell">
                  {issue.category}
                </div>

                <div className="issue-location-cell">

                  <MapPin size={12} />

                  {issue.location}

                </div>

                <div>

                  <span
                    className={`issue-priority ${issue.priority.toLowerCase()}`}
                  >
                    {issue.priority}
                  </span>

                </div>

                <div>

                  <span
                    className={`issue-status ${issue.status.toLowerCase()}`}
                  >
                    {statusLabels[issue.status]}
                  </span>

                </div>

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