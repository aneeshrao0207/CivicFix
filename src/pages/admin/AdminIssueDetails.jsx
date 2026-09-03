import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  ShieldCheck,
  User,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import "./AdminIssueDetails.css";

const issueData = {
  "CF-1024": {
    id: "CF-1024",
    title: "Large pothole near Main Road",
    category: "Road",
    description:
      "There is a large pothole near the bus stop causing difficulty for two-wheelers and creating a potential safety hazard for road users.",
    location: "Main Road, Bengaluru",
    priority: "HIGH",
    status: "IN_PROGRESS",
    department: "Road Maintenance",
    reportedBy: "Aneesh Rao",
    reportedDate: "September 2, 2026",
    reportedTime: "10:32 AM",
  },

  "CF-1023": {
    id: "CF-1023",
    title: "Broken streetlight near bus stop",
    category: "Streetlight",
    description:
      "The streetlight near the bus stop has stopped working and the area becomes poorly lit after sunset.",
    location: "MG Road, Bengaluru",
    priority: "MEDIUM",
    status: "UNDER_REVIEW",
    department: "Electrical",
    reportedBy: "Rahul Kumar",
    reportedDate: "September 2, 2026",
    reportedTime: "09:45 AM",
  },

  "CF-1022": {
    id: "CF-1022",
    title: "Garbage overflow near residential area",
    category: "Garbage",
    description:
      "The public garbage collection point is overflowing and waste has started spreading onto the surrounding road.",
    location: "Indiranagar, Bengaluru",
    priority: "HIGH",
    status: "ASSIGNED",
    department: "Waste Management",
    reportedBy: "Priya Sharma",
    reportedDate: "September 1, 2026",
    reportedTime: "04:20 PM",
  },

  "CF-1021": {
    id: "CF-1021",
    title: "Water leakage on roadside",
    category: "Water",
    description:
      "A significant amount of water is leaking continuously from a roadside pipeline and causing water accumulation.",
    location: "Whitefield, Bengaluru",
    priority: "CRITICAL",
    status: "REPORTED",
    department: "Water Supply",
    reportedBy: "Kiran R",
    reportedDate: "September 1, 2026",
    reportedTime: "02:15 PM",
  },
};

const statusSteps = [
  {
    key: "REPORTED",
    label: "Reported",
  },
  {
    key: "UNDER_REVIEW",
    label: "Under Review",
  },
  {
    key: "ASSIGNED",
    label: "Assigned",
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    key: "RESOLVED",
    label: "Resolved",
  },
];

const statusOrder = [
  "REPORTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
];

function AdminIssueDetails() {
  const { issueId } = useParams();

  const issue = issueData[issueId] || issueData["CF-1024"];

  const [priority, setPriority] = useState(issue.priority);
  const [department, setDepartment] = useState(issue.department);
  const [status, setStatus] = useState(issue.status);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const currentStatusIndex = statusOrder.indexOf(status);

  const handleUpdate = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="admin-issue-details-page">

      {/* BACK */}

      <div className="admin-issue-back">

        <Link to="/admin/issues">
          <ArrowLeft size={14} />
          Back to issues
        </Link>

      </div>

      {/* HEADER */}

      <header className="admin-issue-details-header">

        <div>

          <div className="admin-issue-id-label">
            {issue.id}
          </div>

          <h1>
            {issue.title}
          </h1>

          <p>
            Review and manage this civic issue.
          </p>

        </div>

        <div
          className={`admin-current-status ${status.toLowerCase()}`}
        >
          <span />
          {status.replaceAll("_", " ")}
        </div>

      </header>

      {/* CONTENT */}

      <div className="admin-issue-details-grid">

        {/* LEFT */}

        <main>

          {/* REPORT INFORMATION */}

          <section className="admin-detail-card">

            <div className="admin-detail-card-header">

              <div>
                <h2>Report information</h2>
                <p>
                  Details submitted by the citizen.
                </p>
              </div>

              <FileText size={16} />

            </div>

            <div className="admin-information-grid">

              <div className="admin-information-item">

                <span>Category</span>

                <strong>
                  {issue.category}
                </strong>

              </div>

              <div className="admin-information-item">

                <span>Reported by</span>

                <strong>
                  {issue.reportedBy}
                </strong>

              </div>

              <div className="admin-information-item">

                <span>Reported date</span>

                <strong>
                  {issue.reportedDate}
                </strong>

              </div>

              <div className="admin-information-item">

                <span>Reported time</span>

                <strong>
                  {issue.reportedTime}
                </strong>

              </div>

            </div>

          </section>

          {/* DESCRIPTION */}

          <section className="admin-detail-card">

            <div className="admin-detail-card-header">

              <div>
                <h2>Description</h2>
                <p>
                  Citizen-provided issue details.
                </p>
              </div>

              <MessageSquare size={16} />

            </div>

            <div className="admin-description">

              <p>
                {issue.description}
              </p>

            </div>

          </section>

          {/* LOCATION */}

          <section className="admin-detail-card">

            <div className="admin-detail-card-header">

              <div>
                <h2>Location</h2>
                <p>
                  Reported issue location.
                </p>
              </div>

              <MapPin size={16} />

            </div>

            <div className="admin-location-box">

              <div className="admin-location-map">

                <MapPin size={23} />

              </div>

              <div className="admin-location-info">

                <span>Reported location</span>

                <strong>
                  {issue.location}
                </strong>

                <small>
                  Location coordinates will appear here
                  when the backend and map service are connected.
                </small>

              </div>

            </div>

          </section>

          {/* STATUS TIMELINE */}

          <section className="admin-detail-card">

            <div className="admin-detail-card-header">

              <div>
                <h2>Issue lifecycle</h2>
                <p>
                  Current progress of the report.
                </p>
              </div>

              <Clock3 size={16} />

            </div>

            <div className="admin-status-timeline">

              {statusSteps.map((step, index) => {

                const isCompleted =
                  index <= currentStatusIndex;

                const isCurrent =
                  index === currentStatusIndex;

                return (
                  <div
                    className={`admin-timeline-step ${
                      isCompleted
                        ? "completed"
                        : ""
                    } ${
                      isCurrent
                        ? "current"
                        : ""
                    }`}
                    key={step.key}
                  >

                    <div className="admin-timeline-marker">

                      {isCompleted ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <span />
                      )}

                    </div>

                    <div>

                      <strong>
                        {step.label}
                      </strong>

                      {isCurrent && (
                        <small>
                          Current status
                        </small>
                      )}

                    </div>

                    {index <
                      statusSteps.length - 1 && (
                      <div
                        className={`admin-timeline-line ${
                          index <
                          currentStatusIndex
                            ? "filled"
                            : ""
                        }`}
                      />
                    )}

                  </div>
                );
              })}

            </div>

          </section>

        </main>

        {/* RIGHT */}

        <aside>

          {/* ADMIN ACTION */}

          <section className="admin-action-card">

            <div className="admin-action-header">

              <div className="admin-action-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <h2>Manage issue</h2>
                <p>
                  Administrative controls
                </p>
              </div>

            </div>

            <div className="admin-action-fields">

              <label>

                <span>Priority</span>

                <div className="admin-detail-select">

                  <select
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value)
                    }
                  >
                    <option value="LOW">
                      Low
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                    <option value="CRITICAL">
                      Critical
                    </option>

                  </select>

                  <ChevronDown size={13} />

                </div>

              </label>

              <label>

                <span>Department</span>

                <div className="admin-detail-select">

                  <select
                    value={department}
                    onChange={(event) =>
                      setDepartment(event.target.value)
                    }
                  >
                    <option>
                      Road Maintenance
                    </option>

                    <option>
                      Electrical
                    </option>

                    <option>
                      Waste Management
                    </option>

                    <option>
                      Water Supply
                    </option>

                    <option>
                      Traffic Department
                    </option>

                    <option>
                      Public Infrastructure
                    </option>

                  </select>

                  <ChevronDown size={13} />

                </div>

              </label>

              <label>

                <span>Status</span>

                <div className="admin-detail-select">

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                  >
                    <option value="REPORTED">
                      Reported
                    </option>

                    <option value="UNDER_REVIEW">
                      Under Review
                    </option>

                    <option value="ASSIGNED">
                      Assigned
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="RESOLVED">
                      Resolved
                    </option>

                    <option value="REJECTED">
                      Rejected
                    </option>

                  </select>

                  <ChevronDown size={13} />

                </div>

              </label>

            </div>

            <button
              className="admin-update-button"
              onClick={handleUpdate}
            >
              {saved
                ? "Issue updated"
                : "Update issue"}
            </button>

          </section>

          {/* ADMIN NOTE */}

          <section className="admin-note-card">

            <div className="admin-note-header">

              <MessageSquare size={15} />

              <div>
                <h2>Administrative note</h2>
                <p>
                  Add an internal note.
                </p>
              </div>

            </div>

            <textarea
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              placeholder="Write an internal note..."
            />

            <button
              className="admin-note-button"
              onClick={() => setNote("")}
            >
              Save note
            </button>

          </section>

          {/* REPORTER */}

          <section className="admin-reporter-card">

            <div className="admin-reporter-icon">
              <User size={16} />
            </div>

            <div>

              <span>Reported by</span>

              <strong>
                {issue.reportedBy}
              </strong>

              <small>
                Citizen reporter
              </small>

            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default AdminIssueDetails;