import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Clock3,
  MapPin,
  Search,
  X,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { Link } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import "./AdminMap.css";

const issues = [
  {
    id: "CF-1024",
    title: "Large pothole near Main Road",
    category: "Road",
    location: "Main Road",
    department: "Road Maintenance",
    priority: "HIGH",
    status: "IN_PROGRESS",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: "CF-1023",
    title: "Broken streetlight near bus stop",
    category: "Streetlight",
    location: "MG Road",
    department: "Electrical",
    priority: "MEDIUM",
    status: "UNDER_REVIEW",
    lat: 12.975,
    lng: 77.605,
  },
  {
    id: "CF-1022",
    title: "Garbage overflow near residential area",
    category: "Garbage",
    location: "Indiranagar",
    department: "Waste Management",
    priority: "HIGH",
    status: "ASSIGNED",
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    id: "CF-1021",
    title: "Water leakage on roadside",
    category: "Water",
    location: "Whitefield",
    department: "Water Supply",
    priority: "CRITICAL",
    status: "REPORTED",
    lat: 12.9698,
    lng: 77.75,
  },
  {
    id: "CF-1020",
    title: "Damaged footpath",
    category: "Infrastructure",
    location: "Koramangala",
    department: "Road Maintenance",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    lat: 12.9352,
    lng: 77.6245,
  },
  {
    id: "CF-1019",
    title: "Traffic signal not working",
    category: "Traffic",
    location: "Silk Board",
    department: "Traffic Department",
    priority: "CRITICAL",
    status: "RESOLVED",
    lat: 12.917,
    lng: 77.6227,
  },
  {
    id: "CF-1018",
    title: "Overflowing public dustbin",
    category: "Garbage",
    location: "HSR Layout",
    department: "Waste Management",
    priority: "LOW",
    status: "RESOLVED",
    lat: 12.9116,
    lng: 77.6389,
  },
];

const statusLabels = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

const markerColors = {
  REPORTED: "#64748b",
  UNDER_REVIEW: "#f97316",
  ASSIGNED: "#8b5cf6",
  IN_PROGRESS: "#2563eb",
  RESOLVED: "#22c55e",
};

function createMarkerIcon(status) {
  const color = markerColors[status] || "#64748b";

  return L.divIcon({
    className: "civicfix-map-marker-wrapper",
    html: `
      <div
        class="civicfix-map-marker"
        style="--marker-color:${color}"
      >
        <span></span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function MapController({ selectedIssue }) {
  const map = useMap();

  if (selectedIssue) {
    map.flyTo(
      [selectedIssue.lat, selectedIssue.lng],
      14,
      {
        duration: 0.8,
      }
    );
  }

  return null;
}

function AdminMap() {
  const [search, setSearch] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredIssues = useMemo(() => {
    const query = search.toLowerCase().trim();

    return issues.filter((issue) => {
      const matchesSearch =
        !query ||
        issue.id.toLowerCase().includes(query) ||
        issue.title.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "ALL" ||
        issue.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const activeIssues = issues.filter(
    (issue) => issue.status !== "RESOLVED"
  );

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "RESOLVED"
  );

  const criticalIssues = issues.filter(
    (issue) => issue.priority === "CRITICAL"
  );

  return (
    <div className="admin-map-page">

      {/* HEADER */}

      <header className="admin-map-header">

        <div>
          <div className="admin-map-eyebrow">
            <MapPin size={13} />
            GEOSPATIAL MONITORING
          </div>

          <h1>Issue Map</h1>

          <p>
            Monitor reported civic issues across the city.
          </p>
        </div>

        <div className="admin-map-summary">

          <div>
            <strong>{activeIssues.length}</strong>
            <span>Active issues</span>
          </div>

          <div>
            <strong>{criticalIssues.length}</strong>
            <span>Critical</span>
          </div>

          <div>
            <strong>{resolvedIssues.length}</strong>
            <span>Resolved</span>
          </div>

        </div>

      </header>

      {/* TOOLBAR */}

      <section className="admin-map-toolbar">

        <div className="admin-map-search">

          <Search size={14} />

          <input
            type="text"
            placeholder="Search issue, location or category..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}

        </div>

        <div className="admin-map-filters">

          {[
            ["ALL", "All"],
            ["REPORTED", "Reported"],
            ["UNDER_REVIEW", "Under Review"],
            ["ASSIGNED", "Assigned"],
            ["IN_PROGRESS", "In Progress"],
            ["RESOLVED", "Resolved"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={
                activeFilter === value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter(value)
              }
            >
              {label}
            </button>
          ))}

        </div>

      </section>

      {/* MAP LAYOUT */}

      <section className="admin-map-layout">

        {/* MAP */}

        <div className="admin-map-container">

          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={12}
            scrollWheelZoom={true}
            className="admin-leaflet-map"
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController
              selectedIssue={selectedIssue}
            />

            {filteredIssues.map((issue) => (

              <Marker
                key={issue.id}
                position={[
                  issue.lat,
                  issue.lng,
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
                      {issue.id}
                    </span>

                    <strong>
                      {issue.title}
                    </strong>

                    <span>
                      {issue.location}
                    </span>

                    <span
                      className={`map-popup-status ${issue.status.toLowerCase()}`}
                    >
                      {statusLabels[issue.status]}
                    </span>

                    <Link
                      to={`/admin/issues/${issue.id}`}
                    >
                      View issue →
                    </Link>

                  </div>

                </Popup>

              </Marker>

            ))}

          </MapContainer>

          {/* MAP LEGEND */}

          <div className="admin-map-legend">

            <strong>Issue status</strong>

            <div>
              <span className="legend-dot reported" />
              Reported
            </div>

            <div>
              <span className="legend-dot review" />
              Under Review
            </div>

            <div>
              <span className="legend-dot assigned" />
              Assigned
            </div>

            <div>
              <span className="legend-dot progress" />
              In Progress
            </div>

            <div>
              <span className="legend-dot resolved" />
              Resolved
            </div>

          </div>

        </div>

        {/* ISSUE LIST */}

        <aside className="admin-map-sidebar">

          <div className="admin-map-sidebar-header">

            <div>
              <h2>Mapped issues</h2>

              <p>
                {filteredIssues.length} issue
                {filteredIssues.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

          </div>

          <div className="admin-map-issue-list">

            {filteredIssues.length === 0 ? (

              <div className="admin-map-empty">

                <Search size={20} />

                <strong>
                  No issues found
                </strong>

                <p>
                  Try changing your search or filter.
                </p>

              </div>

            ) : (

              filteredIssues.map((issue) => (

                <button
                  key={issue.id}
                  className={`admin-map-issue ${
                    selectedIssue?.id === issue.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedIssue(issue)
                  }
                >

                  <div className="admin-map-issue-top">

                    <span className="admin-map-issue-id">
                      {issue.id}
                    </span>

                    <span
                      className={`admin-map-priority ${issue.priority.toLowerCase()}`}
                    >
                      {issue.priority}
                    </span>

                  </div>

                  <strong>
                    {issue.title}
                  </strong>

                  <div className="admin-map-issue-location">

                    <MapPin size={11} />

                    {issue.location}

                  </div>

                  <div className="admin-map-issue-bottom">

                    <span
                      className={`admin-map-status ${issue.status.toLowerCase()}`}
                    >
                      {statusLabels[issue.status]}
                    </span>

                    <span>
                      {issue.category}
                    </span>

                  </div>

                </button>

              ))

            )}

          </div>

        </aside>

      </section>

      {/* SELECTED ISSUE */}

      {selectedIssue && (

        <section className="admin-map-selected">

          <div className="admin-map-selected-icon">
            <AlertTriangle size={17} />
          </div>

          <div className="admin-map-selected-content">

            <span>
              Selected issue · {selectedIssue.id}
            </span>

            <strong>
              {selectedIssue.title}
            </strong>

            <p>
              {selectedIssue.location} ·{" "}
              {selectedIssue.department}
            </p>

          </div>

          <div className="admin-map-selected-status">

            <Clock3 size={13} />

            {statusLabels[selectedIssue.status]}

          </div>

          <Link
            to={`/admin/issues/${selectedIssue.id}`}
          >
            Manage issue
          </Link>

        </section>

      )}

    </div>
  );
}

export default AdminMap;