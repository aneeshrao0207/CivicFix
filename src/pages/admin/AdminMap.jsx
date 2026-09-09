import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Filter,
  LoaderCircle,
  MapPin,
  Search,
  X,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { apiRequest } from "../../services/api";

import "leaflet/dist/leaflet.css";
import "./AdminMap.css";


// ============================================
// FIX LEAFLET DEFAULT MARKER ICONS
// ============================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// ============================================
// FILTER OPTIONS
// ============================================

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


// ============================================
// STATUS COLORS
// ============================================

const statusColors = {
  REPORTED: "#64748b",
  UNDER_REVIEW: "#f59e0b",
  ASSIGNED: "#8b5cf6",
  IN_PROGRESS: "#3b82f6",
  RESOLVED: "#10b981",
  REJECTED: "#ef4444",
};


// ============================================
// HELPERS
// ============================================

const getStatusLabel = (status) => {
  if (!status) return "Unknown";

  return (
    statusLabels[status] ||
    status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
};

const getIssueId = (issue) => issue?.id || issue?.issue_id;


// ============================================
// CUSTOM MAP MARKER
// ============================================

const createMarkerIcon = (status = "REPORTED") => {
  const color =
    statusColors[status] || statusColors.REPORTED;

  return L.divIcon({
    className: "civic-map-marker-wrapper",

    html: `
      <div
        class="civic-map-marker"
        style="--marker-color:${color}"
        aria-hidden="true"
      >
        <span class="civic-map-marker-core"></span>
      </div>
    `,

    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -39],
  });
};


// ============================================
// MAP CONTROLLER
// ============================================

function MapController({ selectedIssue }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedIssue) return;

    const latitude = Number(selectedIssue.latitude);
    const longitude = Number(selectedIssue.longitude);

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      map.flyTo(
        [latitude, longitude],
        16,
        {
          duration: 0.7,
        }
      );
    }
  }, [selectedIssue, map]);

  return null;
}


// ============================================
// MAIN COMPONENT
// ============================================

function AdminMap() {
  const [issues, setIssues] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [selectedIssue, setSelectedIssue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ============================================
  // FETCH ISSUES
  // ============================================

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/issues");

      setIssues(data.issues || []);
    } catch (fetchError) {
      console.error(
        "Failed to fetch map issues:",
        fetchError
      );

      setError(
        fetchError.message ||
          "Unable to load issue locations."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchIssues();
  }, []);


  // ============================================
  // ISSUES WITH VALID COORDINATES
  // ============================================

  const mappedIssues = useMemo(() => {
    return issues.filter((issue) => {
      const latitude = Number(issue.latitude);
      const longitude = Number(issue.longitude);

      return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      );
    });
  }, [issues]);


  // ============================================
  // FILTERED ISSUES
  // ============================================

  const filteredIssues = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return mappedIssues.filter((issue) => {
      const reportId =
        issue.report_id?.toLowerCase() || "";

      const title =
        issue.title?.toLowerCase() || "";

      const address =
        issue.address?.toLowerCase() || "";

      const category =
        issue.category?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        reportId.includes(searchValue) ||
        title.includes(searchValue) ||
        address.includes(searchValue) ||
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
    mappedIssues,
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);


  // ============================================
  // MAP CENTER
  // ============================================

  const mapCenter = useMemo(() => {
    if (filteredIssues.length > 0) {
      return [
        Number(filteredIssues[0].latitude),
        Number(filteredIssues[0].longitude),
      ];
    }

    if (mappedIssues.length > 0) {
      return [
        Number(mappedIssues[0].latitude),
        Number(mappedIssues[0].longitude),
      ];
    }

    // Bengaluru fallback
    return [12.9716, 77.5946];
  }, [filteredIssues, mappedIssues]);


  // ============================================
  // SUMMARY COUNTS
  // ============================================

  const criticalCount = issues.filter(
    (issue) =>
      issue.priority === "CRITICAL"
  ).length;

  const pendingCount = issues.filter(
    (issue) =>
      issue.status === "REPORTED" ||
      issue.status === "UNDER_REVIEW"
  ).length;

  const progressCount = issues.filter(
    (issue) =>
      issue.status === "ASSIGNED" ||
      issue.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = issues.filter(
    (issue) =>
      issue.status === "RESOLVED"
  ).length;


  // ============================================
  // ACTIVE FILTER CHECK
  // ============================================

  const hasActiveFilters =
    Boolean(search.trim()) ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    categoryFilter !== "ALL";


  // ============================================
  // CLEAR FILTERS
  // ============================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCategoryFilter("ALL");
    setSelectedIssue(null);
  };


  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="admin-map-page">

        <div className="admin-map-loading">

          <div className="admin-map-loading-icon">
            <LoaderCircle
              size={25}
              className="map-loading-spinner"
            />
          </div>

          <strong>
            Loading issue map
          </strong>

          <p>
            Fetching civic issue locations.
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="admin-map-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="admin-map-header">

        <div>

          <div className="admin-map-eyebrow">
            <MapPin size={13} />
            GEOGRAPHIC MONITORING
          </div>

          <h1>
            Issue Map
          </h1>

          <p>
            Monitor reported civic issues across the city.
          </p>

        </div>

        <Link
          to="/admin/issues"
          className="admin-map-header-link"
        >
          View all issues
          <ArrowRight size={14} />
        </Link>

      </header>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="admin-map-error">

          <AlertTriangle size={17} />

          <div className="admin-map-error-content">

            <strong>
              Unable to load map data
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            type="button"
            className="admin-map-retry"
            onClick={fetchIssues}
          >
            <RefreshCw size={13} />
            Retry
          </button>

        </div>
      )}


      {/* =====================================
          SUMMARY
      ===================================== */}

      <section className="admin-map-summary">

        <div>
          <span className="summary-dot critical" />
          <span>Critical</span>
          <strong>{criticalCount}</strong>
        </div>

        <div>
          <span className="summary-dot pending" />
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div>
          <span className="summary-dot progress" />
          <span>In progress</span>
          <strong>{progressCount}</strong>
        </div>

        <div>
          <span className="summary-dot resolved" />
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
        </div>

        <div className="map-summary-total">

          <span>
            Mapped issues
          </span>

          <strong>
            {filteredIssues.length}
          </strong>

          <small>
            of {mappedIssues.length}
          </small>

        </div>

      </section>


      {/* =====================================
          MAP WORKSPACE
      ===================================== */}

      <section className="admin-map-workspace">


        {/* ===================================
            SIDEBAR
        =================================== */}

        <aside className="admin-map-sidebar">

          <div className="map-sidebar-header">

            <div>

              <span className="map-sidebar-kicker">
                <Filter size={13} />
                FILTERS
              </span>

              <h2>
                Find issues
              </h2>

            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="clear-map-filters"
              >
                Clear
              </button>
            )}

          </div>


          {/* SEARCH */}

          <div className="map-search">

            <Search size={15} />

            <input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search issues"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

          </div>


          {/* STATUS */}

          <label className="map-filter">

            <span>
              Status
            </span>

            <div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                {Object.entries(statusLabels).map(
                  ([value, label]) => (
                    <option
                      value={value}
                      key={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

              <ChevronDown size={13} />

            </div>

          </label>


          {/* PRIORITY */}

          <label className="map-filter">

            <span>
              Priority
            </span>

            <div>

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value)
                }
              >
                {Object.entries(priorityLabels).map(
                  ([value, label]) => (
                    <option
                      value={value}
                      key={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

              <ChevronDown size={13} />

            </div>

          </label>


          {/* CATEGORY */}

          <label className="map-filter">

            <span>
              Category
            </span>

            <div>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
              >
                {Object.entries(categoryLabels).map(
                  ([value, label]) => (
                    <option
                      value={value}
                      key={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

              <ChevronDown size={13} />

            </div>

          </label>


          {/* ISSUE LIST HEADER */}

          <div className="map-issue-list-header">

            <span>
              Issues on map
            </span>

            <strong>
              {filteredIssues.length}
            </strong>

          </div>


          {/* ISSUE LIST */}

          <div className="map-issue-list">

            {filteredIssues.length === 0 ? (

              <div className="map-no-results">

                <div className="map-no-results-icon">
                  <MapPin size={19} />
                </div>

                <strong>
                  No mapped issues
                </strong>

                <p>
                  {hasActiveFilters
                    ? "Try changing your filters."
                    : "No reported issues have valid map coordinates yet."}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                )}

              </div>

            ) : (

              filteredIssues.map((issue) => {

                const issueId = getIssueId(issue);

                const isSelected =
                  String(selectedIssue?.id) ===
                  String(issueId);

                return (
                  <button
                    type="button"
                    key={issueId}
                    className={`map-issue-item ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() =>
                      setSelectedIssue(issue)
                    }
                  >

                    <span
                      className="map-issue-status-dot"
                      style={{
                        background:
                          statusColors[
                            issue.status
                          ] ||
                          statusColors.REPORTED,
                      }}
                    />

                    <span className="map-issue-item-content">

                      <strong>
                        {issue.title ||
                          "Civic issue"}
                      </strong>

                      <small>
                        {issue.report_id ||
                          `CF-${issueId}`}
                        {" · "}
                        {issue.category ||
                          "General"}
                      </small>

                    </span>

                    <ArrowRight size={13} />

                  </button>
                );
              })

            )}

          </div>

        </aside>


        {/* ===================================
            MAP
        =================================== */}

        <div className="admin-map-container">

          <MapContainer
            center={mapCenter}
            zoom={14}
            scrollWheelZoom={true}
            className="civic-leaflet-map"
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController
              selectedIssue={selectedIssue}
            />

            {filteredIssues.map((issue) => {

              const issueId = getIssueId(issue);

              const latitude =
                Number(issue.latitude);

              const longitude =
                Number(issue.longitude);

              return (
                <Marker
                  key={issueId}
                  position={[
                    latitude,
                    longitude,
                  ]}
                  icon={createMarkerIcon(
                    issue.status
                  )}
                  eventHandlers={{
                    click: () =>
                      setSelectedIssue(issue),
                  }}
                >

                  <Popup>

                    <div className="map-popup">

                      <span className="map-popup-id">
                        {issue.report_id ||
                          `CF-${issueId}`}
                      </span>

                      <h3>
                        {issue.title ||
                          "Civic issue"}
                      </h3>

                      <div className="map-popup-meta">

                        <span>
                          {issue.category ||
                            "General"}
                        </span>

                        <span
                          className={`popup-status ${
                            issue.status?.toLowerCase() ||
                            ""
                          }`}
                        >
                          {getStatusLabel(
                            issue.status
                          )}
                        </span>

                      </div>

                      <div className="map-popup-location">

                        <MapPin size={13} />

                        <span>
                          {issue.address ||
                            "Location coordinates provided"}
                        </span>

                      </div>

                      <div className="map-popup-priority">

                        <span>
                          Priority
                        </span>

                        <strong
                          className={`priority-${issue.priority?.toLowerCase() || "medium"}`}
                        >
                          {issue.priority ||
                            "MEDIUM"}
                        </strong>

                      </div>

                      <Link
                        to={`/admin/issues/${issueId}`}
                        className="map-popup-link"
                      >
                        View issue
                        <ArrowRight size={13} />
                      </Link>

                    </div>

                  </Popup>

                </Marker>
              );
            })}

          </MapContainer>


          {/* =================================
              MAP LEGEND
          ================================= */}

          <div className="map-legend">

            <strong>
              Status
            </strong>

            <span>
              <i className="legend-status reported" />
              Reported
            </span>

            <span>
              <i className="legend-status review" />
              Under Review
            </span>

            <span>
              <i className="legend-status assigned" />
              Assigned
            </span>

            <span>
              <i className="legend-status progress" />
              In Progress
            </span>

            <span>
              <i className="legend-status resolved" />
              Resolved
            </span>

            <span>
              <i className="legend-status rejected" />
              Rejected
            </span>

          </div>


          {/* =================================
              MISSING LOCATION NOTICE
          ================================= */}

          {issues.length > mappedIssues.length && (

            <div className="map-missing-location">

              <MapPin size={14} />

              <span>
                {issues.length -
                  mappedIssues.length}{" "}
                issue
                {issues.length -
                  mappedIssues.length !== 1
                  ? "s"
                  : ""}{" "}
                without map coordinates
              </span>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default AdminMap;