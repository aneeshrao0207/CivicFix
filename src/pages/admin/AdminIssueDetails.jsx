import { useEffect, useState } from "react";

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
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { apiRequest } from "../../services/api";

import "./AdminIssueDetails.css";

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

const statusLabels = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

function AdminIssueDetails() {
  // IMPORTANT:
  // AdminIssues.jsx navigates to /admin/issues/${issue.id}
  // and App.jsx defines the route as /admin/issues/:id
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // FETCH ISSUE
  // ============================================

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/issues/${id}`);

        if (!data.issue) {
          throw new Error("Issue data was not returned.");
        }

        const fetchedIssue = data.issue;

        setIssue(fetchedIssue);

        setPriority(fetchedIssue.priority || "MEDIUM");
        setDepartment(
          fetchedIssue.assigned_department
            ? String(fetchedIssue.assigned_department)
            : ""
        );
        setStatus(fetchedIssue.status || "REPORTED");

      } catch (fetchError) {
        console.error(
          "Failed to fetch issue:",
          fetchError
        );

        setError(
          fetchError.message ||
            "Unable to load this issue."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIssue();
    }
  }, [id]);

  // ============================================
  // FETCH DEPARTMENTS
  // ============================================

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await apiRequest("/departments");

        setDepartments(data.departments || []);

      } catch (departmentError) {
        console.error(
          "Failed to fetch departments:",
          departmentError
        );
      }
    };

    fetchDepartments();
  }, []);

  // ============================================
  // UPDATE ISSUE
  // ============================================

  const handleUpdate = async () => {
    if (!issue) return;

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const data = await apiRequest(
        `/issues/${issue.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            priority,
            assignedDepartment:
              department || null,
            note:
              note.trim() ||
              "Issue updated by administrator.",
          }),
        }
      );

      if (!data.issue) {
        throw new Error(
          "Updated issue was not returned."
        );
      }

      setIssue(data.issue);

      setPriority(
        data.issue.priority || priority
      );

      setDepartment(
        data.issue.assigned_department
          ? String(data.issue.assigned_department)
          : ""
      );

      setStatus(
        data.issue.status || status
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);

    } catch (updateError) {
      console.error(
        "Failed to update issue:",
        updateError
      );

      setError(
        updateError.message ||
          "Unable to update this issue."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="admin-issue-details-page">

        <div className="admin-issues-loading">

          <LoaderCircle
            size={25}
            className="loading-spinner"
          />

          <strong>
            Loading issue...
          </strong>

          <p>
            Fetching issue details from the database.
          </p>

        </div>

      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error && !issue) {
    return (
      <div className="admin-issue-details-page">

        <div className="admin-issue-back">

          <Link to="/admin/issues">
            <ArrowLeft size={14} />
            Back to issues
          </Link>

        </div>

        <div className="admin-issues-error">

          <AlertTriangle size={18} />

          <div>
            <strong>
              Unable to load issue
            </strong>

            <p>
              {error}
            </p>
          </div>

        </div>

      </div>
    );
  }

  if (!issue) {
    return null;
  }

  // ============================================
  // DISPLAY VALUES
  // ============================================

  const currentStatusIndex =
    statusOrder.indexOf(status);

  const reporterName =
    issue.reporter_name ||
    "Unknown citizen";

  const issueDate = issue.created_at
    ? new Date(issue.created_at)
    : null;

  const reportedDate = issueDate
    ? issueDate.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Unknown date";

  const reportedTime = issueDate
    ? issueDate.toLocaleTimeString(
        "en-IN",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )
    : "Unknown time";

  const departmentName =
    departments.find(
      (dept) =>
        String(dept.id) ===
        String(issue.assigned_department)
    )?.name ||
    issue.department_name ||
    "Not assigned";

  return (
    <div className="admin-issue-details-page">

      {/* =====================================
          BACK
      ===================================== */}

      <div className="admin-issue-back">

        <Link to="/admin/issues">

          <ArrowLeft size={14} />

          Back to issues

        </Link>

      </div>


      {/* =====================================
          HEADER
      ===================================== */}

      <header className="admin-issue-details-header">

        <div>

          <div className="admin-issue-id-label">

            {issue.report_id ||
              `CF-${issue.id}`}

          </div>

          <h1>
            {issue.title}
          </h1>

          <p>
            Review and manage this civic issue.
          </p>

        </div>

        <div
          className={`admin-current-status ${
            status.toLowerCase()
          }`}
        >

          <span />

          {statusLabels[status] ||
            status.replaceAll("_", " ")}

        </div>

      </header>


      {/* =====================================
          ERROR AFTER UPDATE
      ===================================== */}

      {error && (
        <div className="admin-issues-error">

          <AlertTriangle size={17} />

          <div>

            <strong>
              Unable to update issue
            </strong>

            <p>
              {error}
            </p>

          </div>

        </div>
      )}


      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="admin-issue-details-grid">

        {/* ===================================
            LEFT
        =================================== */}

        <main>

          {/* REPORT INFORMATION */}

          <section className="admin-detail-card">

            <div className="admin-detail-card-header">

              <div>

                <h2>
                  Report information
                </h2>

                <p>
                  Details submitted by the citizen.
                </p>

              </div>

              <FileText size={16} />

            </div>


            <div className="admin-information-grid">

              <div className="admin-information-item">

                <span>
                  Category
                </span>

                <strong>
                  {issue.category || "—"}
                </strong>

              </div>


              <div className="admin-information-item">

                <span>
                  Reported by
                </span>

                <strong>
                  {reporterName}
                </strong>

              </div>


              <div className="admin-information-item">

                <span>
                  Reported date
                </span>

                <strong>
                  {reportedDate}
                </strong>

              </div>


              <div className="admin-information-item">

                <span>
                  Reported time
                </span>

                <strong>
                  {reportedTime}
                </strong>

              </div>

            </div>

          </section>


          {/* DESCRIPTION */}

          <section className="admin-detail-card">

            <div className="admin-detail-card-header">

              <div>

                <h2>
                  Description
                </h2>

                <p>
                  Citizen-provided issue details.
                </p>

              </div>

              <MessageSquare size={16} />

            </div>


            <div className="admin-description">

              <p>
                {issue.description ||
                  "No description provided."}
              </p>

            </div>

          </section>


          {/* LOCATION */}

          <section className="admin-detail-card">

            <div className="admin-detail-card-header">

              <div>

                <h2>
                  Location
                </h2>

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

                <span>
                  Reported location
                </span>

                <strong>
                  {issue.address ||
                    "Location not provided"}
                </strong>

                <small>
                  {issue.latitude &&
                  issue.longitude
                    ? `Coordinates: ${issue.latitude}, ${issue.longitude}`
                    : "Location coordinates were not provided with this report."}
                </small>

              </div>

            </div>

          </section>


          {/* STATUS TIMELINE */}

          <section className="admin-detail-card">

            <div className="admin-detail-card-header">

              <div>

                <h2>
                  Issue lifecycle
                </h2>

                <p>
                  Current progress of the report.
                </p>

              </div>

              <Clock3 size={16} />

            </div>


            <div className="admin-status-timeline">

              {statusSteps.map(
                (step, index) => {

                  const isCompleted =
                    currentStatusIndex >=
                    index;

                  const isCurrent =
                    step.key === status;

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
                          <CheckCircle2
                            size={14}
                          />
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
                        statusSteps.length -
                          1 && (
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
                }
              )}

            </div>

          </section>

        </main>


        {/* ===================================
            RIGHT
        =================================== */}

        <aside>

          {/* ADMIN ACTION */}

          <section className="admin-action-card">

            <div className="admin-action-header">

              <div className="admin-action-icon">

                <ShieldCheck size={17} />

              </div>

              <div>

                <h2>
                  Manage issue
                </h2>

                <p>
                  Administrative controls
                </p>

              </div>

            </div>


            <div className="admin-action-fields">

              {/* PRIORITY */}

              <label>

                <span>
                  Priority
                </span>

                <div className="admin-detail-select">

                  <select
                    value={priority}
                    onChange={(event) =>
                      setPriority(
                        event.target.value
                      )
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


              {/* DEPARTMENT */}

              <label>

                <span>
                  Department
                </span>

                <div className="admin-detail-select">

                  <select
                    value={department}
                    onChange={(event) =>
                      setDepartment(
                        event.target.value
                      )
                    }
                  >

                    <option value="">
                      Not assigned
                    </option>

                    {departments.map(
                      (dept) => (
                        <option
                          key={dept.id}
                          value={dept.id}
                        >
                          {dept.name}
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown size={13} />

                </div>

              </label>


              {/* STATUS */}

              <label>

                <span>
                  Status
                </span>

                <div className="admin-detail-select">

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value
                      )
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


            {/* UPDATE */}

            <button
              className="admin-update-button"
              onClick={handleUpdate}
              disabled={saving}
            >

              {saving
                ? "Updating..."
                : saved
                ? "Issue updated"
                : "Update issue"}

            </button>

          </section>


          {/* ADMIN NOTE */}

          <section className="admin-note-card">

            <div className="admin-note-header">

              <MessageSquare size={15} />

              <div>

                <h2>
                  Administrative note
                </h2>

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
              onClick={() =>
                setNote("")
              }
            >
              Clear note
            </button>

          </section>


          {/* REPORTER */}

          <section className="admin-reporter-card">

            <div className="admin-reporter-icon">

              <User size={16} />

            </div>


            <div>

              <span>
                Reported by
              </span>

              <strong>
                {reporterName}
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