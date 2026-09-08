import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Flag,
  Image as ImageIcon,
  MapPin,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import { apiRequest } from "../../services/api";
import "./IssueDetails.css";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "status-pending",
    icon: Clock3,
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "status-progress",
    icon: RefreshCw,
  },
  RESOLVED: {
    label: "Resolved",
    className: "status-resolved",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className: "status-rejected",
    icon: XCircle,
  },
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusConfig = (status) => {
  const normalizedStatus = String(status || "PENDING").toUpperCase();

  return (
    STATUS_CONFIG[normalizedStatus] || {
      label: normalizedStatus.replace(/_/g, " "),
      className: "status-default",
      icon: Clock3,
    }
  );
};

const getPriorityLabel = (priority) => {
  if (!priority) return "Normal";

  return String(priority)
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
};

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/issues/${id}`);

        setIssue(data.issue || data);
      } catch (err) {
        setError(err.message || "Unable to load this report.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  if (loading) {
    return (
      <main className="issue-details-page">
        <div className="issue-details-container">
          <div className="issue-details-loading">
            <div className="loading-spinner" />
            <h2>Loading report</h2>
            <p>We're retrieving the latest information about your report.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !issue) {
    return (
      <main className="issue-details-page">
        <div className="issue-details-container">
          <div className="issue-details-error">
            <div className="error-icon">
              <XCircle size={24} />
            </div>

            <div>
              <span className="eyebrow">REPORT UNAVAILABLE</span>
              <h2>We couldn't load this report</h2>
              <p>{error || "The requested report could not be found."}</p>
            </div>

            <button
              type="button"
              className="issue-secondary-button"
              onClick={() => navigate("/citizen/reports")}
            >
              <ArrowLeft size={17} />
              Back to My Reports
            </button>
          </div>
        </div>
      </main>
    );
  }

  const statusConfig = getStatusConfig(issue.status);
  const StatusIcon = statusConfig.icon;

  const updates = Array.isArray(issue.updates) ? issue.updates : [];

  const evidenceUrl =
    issue.imageUrl ||
    issue.image_url ||
    issue.image ||
    null;

  const location =
    issue.address ||
    issue.location ||
    "Location not provided";

  return (
    <main className="issue-details-page">
      <div className="issue-details-container">

        {/* PAGE HEADER */}
        <header className="issue-details-header">
          <Link to="/citizen/reports" className="back-link">
            <ArrowLeft size={17} />
            Back to My Reports
          </Link>

          <div className="issue-header-content">
            <div>
              <div className="issue-id-row">
                <span className="eyebrow">CIVIC REPORT</span>
                <span className="issue-id">
                  {issue.report_id || issue.reportId || `CF-${id}`}
                </span>
              </div>

              <h1>{issue.title || "Untitled Report"}</h1>

              <p className="issue-header-description">
                Track the progress and latest updates for your submitted
                civic issue.
              </p>
            </div>

            <div className={`issue-status ${statusConfig.className}`}>
              <StatusIcon size={17} />
              <span>{statusConfig.label}</span>
            </div>
          </div>
        </header>

        {/* SUMMARY STRIP */}
        <section className="issue-summary-card">
          <div className="summary-item">
            <span className="summary-label">Category</span>
            <strong>{issue.category || "—"}</strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-item">
            <span className="summary-label">Priority</span>
            <strong>{getPriorityLabel(issue.priority)}</strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-item">
            <span className="summary-label">Submitted</span>
            <strong>
              {formatDate(issue.created_at || issue.createdAt)}
            </strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-item">
            <span className="summary-label">Report ID</span>
            <strong>
              {issue.report_id || issue.reportId || `CF-${id}`}
            </strong>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="issue-details-grid">

          {/* LEFT COLUMN */}
          <div className="issue-details-main">

            {/* DESCRIPTION */}
            <section className="details-card">
              <div className="details-card-heading">
                <div className="section-icon">
                  <FileText size={18} />
                </div>

                <div>
                  <h2>Issue description</h2>
                  <p>Information provided when this report was submitted.</p>
                </div>
              </div>

              <div className="description-content">
                {issue.description ? (
                  <p>{issue.description}</p>
                ) : (
                  <p className="muted-text">
                    No description was provided for this report.
                  </p>
                )}
              </div>
            </section>

            {/* LOCATION */}
            <section className="details-card">
              <div className="details-card-heading">
                <div className="section-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <h2>Issue location</h2>
                  <p>Where the civic issue was reported.</p>
                </div>
              </div>

              <div className="location-box">
                <div className="location-marker">
                  <MapPin size={20} />
                </div>

                <div>
                  <span className="location-label">Reported location</span>
                  <p>{location}</p>
                </div>
              </div>

              {(issue.latitude || issue.lat) &&
                (issue.longitude || issue.long) && (
                  <div className="coordinates">
                    <span>
                      Latitude: {issue.latitude || issue.lat}
                    </span>
                    <span>
                      Longitude: {issue.longitude || issue.long}
                    </span>
                  </div>
                )}
            </section>

            {/* EVIDENCE */}
            <section className="details-card">
              <div className="details-card-heading">
                <div className="section-icon">
                  <ImageIcon size={18} />
                </div>

                <div>
                  <h2>Evidence</h2>
                  <p>Photos or supporting evidence attached to this report.</p>
                </div>
              </div>

              {evidenceUrl ? (
                <div className="evidence-preview">
                  <img
                    src={evidenceUrl}
                    alt="Evidence submitted with this report"
                  />
                </div>
              ) : (
                <div className="evidence-empty">
                  <div className="evidence-empty-icon">
                    <ImageIcon size={21} />
                  </div>

                  <div>
                    <strong>No evidence attached</strong>
                    <p>
                      This report was submitted without an image.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="issue-details-sidebar">

            {/* CURRENT STATUS */}
            <section className="status-card">
              <div className="status-card-top">
                <span className="eyebrow">CURRENT STATUS</span>

                <div className={`large-status-icon ${statusConfig.className}`}>
                  <StatusIcon size={21} />
                </div>
              </div>

              <h2>{statusConfig.label}</h2>

              <p>
                {issue.status === "RESOLVED"
                  ? "This issue has been marked as resolved."
                  : issue.status === "REJECTED"
                  ? "This report has been reviewed and rejected."
                  : issue.status === "IN_PROGRESS"
                  ? "The responsible authority is currently working on this issue."
                  : "Your report has been received and is awaiting action."}
              </p>

              <div className="status-card-footer">
                <ShieldCheck size={16} />
                <span>Updates are provided by CivicFix authorities</span>
              </div>
            </section>

            {/* REPORT INFORMATION */}
            <section className="details-card compact-card">
              <div className="details-card-heading">
                <div className="section-icon">
                  <Flag size={18} />
                </div>

                <div>
                  <h2>Report information</h2>
                  <p>Key details about this submission.</p>
                </div>
              </div>

              <div className="info-list">
                <div className="info-row">
                  <span>Category</span>
                  <strong>{issue.category || "—"}</strong>
                </div>

                <div className="info-row">
                  <span>Priority</span>
                  <strong>{getPriorityLabel(issue.priority)}</strong>
                </div>

                <div className="info-row">
                  <span>Submitted</span>
                  <strong>
                    {formatDateTime(
                      issue.created_at || issue.createdAt
                    )}
                  </strong>
                </div>

                {issue.department_name && (
                  <div className="info-row">
                    <span>Department</span>
                    <strong>{issue.department_name}</strong>
                  </div>
                )}
              </div>
            </section>

            {/* TIMELINE */}
            <section className="details-card timeline-card">
              <div className="details-card-heading">
                <div className="section-icon">
                  <Clock3 size={18} />
                </div>

                <div>
                  <h2>Report timeline</h2>
                  <p>Track every important update.</p>
                </div>
              </div>

              {updates.length > 0 ? (
                <div className="timeline">
                  {updates.map((update, index) => {
                    const updateStatus = getStatusConfig(
                      update.status || issue.status
                    );

                    const UpdateIcon = updateStatus.icon;

                    return (
                      <div
                        className={`timeline-item ${
                          index === 0 ? "timeline-item-latest" : ""
                        }`}
                        key={update.id || index}
                      >
                        <div className="timeline-marker">
                          <UpdateIcon size={14} />
                        </div>

                        {index !== updates.length - 1 && (
                          <div className="timeline-line" />
                        )}

                        <div className="timeline-content">
                          <div className="timeline-top">
                            <strong>
                              {update.status
                                ? updateStatus.label
                                : "Report update"}
                            </strong>

                            {index === 0 && (
                              <span className="latest-pill">Latest</span>
                            )}
                          </div>

                          <span className="timeline-date">
                            {formatDateTime(
                              update.created_at ||
                                update.createdAt
                            )}
                          </span>

                          {update.message && (
                            <p>{update.message}</p>
                          )}

                          {update.notes && (
                            <p>{update.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="timeline-empty">
                  <div className="timeline-empty-icon">
                    <MessageSquareText size={19} />
                  </div>

                  <strong>No updates yet</strong>

                  <p>
                    You'll see authority updates here as your
                    report progresses.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>

        {/* BOTTOM TRUST BAR */}
        <section className="issue-trust-bar">
          <div className="trust-bar-icon">
            <ShieldCheck size={19} />
          </div>

          <div>
            <strong>Your report is being tracked securely</strong>
            <p>
              Keep your report ID handy when referring to this issue.
            </p>
          </div>

          <Link to="/citizen/reports" className="trust-bar-link">
            View all reports
          </Link>
        </section>

      </div>
    </main>
  );
}

export default IssueDetails;