import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  UserRound,
  AlertCircle,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { apiRequest } from "../../services/api";

import "./IssueDetails.css";

const statusLabels = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

function IssueDetails() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FETCH ISSUE DETAILS
  // ============================================

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/issues/${id}`);

        if (!data.issue) {
          throw new Error("Report information was not found.");
        }

        setReport(data.issue);
        setTimeline(data.timeline || []);
      } catch (fetchError) {
        console.error(
          "Failed to fetch issue:",
          fetchError
        );

        setError(
          fetchError.message ||
            "Unable to load this report."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="citizen-issue-page">

        <div className="issue-topbar">

          <Link
            to="/citizen/reports"
            className="back-link"
          >
            <ArrowLeft size={16} />
            Back to My Reports
          </Link>

        </div>

        <main className="issue-details-container">

          <div className="reports-empty">

            <div className="reports-empty-icon">
              <FileText size={23} />
            </div>

            <h2>
              Loading report...
            </h2>

            <p>
              Fetching the latest report information.
            </p>

          </div>

        </main>

      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error || !report) {
    return (
      <div className="citizen-issue-page">

        <div className="issue-topbar">

          <Link
            to="/citizen/reports"
            className="back-link"
          >
            <ArrowLeft size={16} />
            Back to My Reports
          </Link>

        </div>

        <main className="issue-details-container">

          <div className="reports-empty">

            <div className="reports-empty-icon">
              <AlertCircle size={23} />
            </div>

            <h2>
              Unable to load report
            </h2>

            <p>
              {error ||
                "This report could not be found."}
            </p>

            <Link to="/citizen/reports">
              Return to My Reports
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // ============================================
  // FORMATTED DATA
  // ============================================

  const formattedDate = report.created_at
    ? new Date(
        report.created_at
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Date unavailable";

  const currentStatus =
    statusLabels[report.status] ||
    report.status ||
    "Reported";

  return (
    <div className="citizen-issue-page">

      {/* =====================================
          TOP BAR
      ===================================== */}

      <div className="issue-topbar">

        <Link
          to="/citizen/reports"
          className="back-link"
        >
          <ArrowLeft size={16} />
          Back to My Reports
        </Link>

        <span className="issue-reference">
          {report.report_id ||
            `CF-${report.id}`}
        </span>

      </div>


      <main className="issue-details-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <section className="issue-details-header">

          <div>

            <div className="issue-header-meta">

              <span className="issue-category">
                {report.category ||
                  "General"}
              </span>

              <span className="issue-dot">
                •
              </span>

              <span>
                Reported {formattedDate}
              </span>

            </div>

            <h1>
              {report.title ||
                "Civic issue"}
            </h1>

            <p>
              {report.description ||
                "No description provided."}
            </p>

          </div>


          <div className="issue-current-status">

            <span>
              Current status
            </span>

            <strong>
              {currentStatus}
            </strong>

          </div>

        </section>


        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="issue-details-grid">

          {/* =================================
              LEFT COLUMN
          ================================= */}

          <div className="issue-main-column">

            {/* TIMELINE */}

            <section className="issue-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    Report timeline
                  </h2>

                  <p>
                    Follow the progress of your report.
                  </p>

                </div>

                <Clock3 size={18} />

              </div>


              <div className="issue-timeline">

                {timeline.length > 0 ? (

                  timeline.map(
                    (item, index) => {

                      const isLast =
                        index ===
                        timeline.length - 1;

                      return (
                        <div
                          className={`timeline-item ${
                            isLast
                              ? "active"
                              : ""
                          }`}
                          key={
                            item.id ||
                            `${item.status}-${index}`
                          }
                        >

                          <div className="timeline-marker">

                            <CheckCircle2
                              size={17}
                            />

                          </div>


                          <div className="timeline-content">

                            <div className="timeline-title-row">

                              <h3>
                                {statusLabels[
                                  item.status
                                ] ||
                                  item.status ||
                                  "Status updated"}
                              </h3>

                              {item.created_at && (
                                <span>
                                  {new Date(
                                    item.created_at
                                  ).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              )}

                            </div>


                            <p>
                              {item.note ||
                                "Issue status updated."}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )

                ) : (

                  <div className="timeline-item active">

                    <div className="timeline-marker">

                      <CheckCircle2
                        size={17}
                      />

                    </div>

                    <div className="timeline-content">

                      <div className="timeline-title-row">

                        <h3>
                          Report submitted
                        </h3>

                      </div>

                      <p>
                        Your report was successfully
                        received by CivicFix.
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </section>


            {/* ISSUE INFORMATION */}

            <section className="issue-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    Issue information
                  </h2>

                  <p>
                    Details submitted with your report.
                  </p>

                </div>

                <FileText size={18} />

              </div>


              <div className="issue-information">

                <div>

                  <span>
                    Description
                  </span>

                  <p>
                    {report.description ||
                      "No description provided."}
                  </p>

                </div>


                <div>

                  <span>
                    Category
                  </span>

                  <strong>
                    {report.category ||
                      "General"}
                  </strong>

                </div>


                <div>

                  <span>
                    Priority
                  </span>

                  <strong className="priority-high">
                    {report.priority ||
                      "NORMAL"}
                  </strong>

                </div>

              </div>

            </section>

          </div>


          {/* =================================
              RIGHT COLUMN
          ================================= */}

          <aside className="issue-side-column">

            {/* LOCATION */}

            <section className="issue-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    Location
                  </h2>

                  <p>
                    Where the issue was reported.
                  </p>

                </div>

                <MapPin size={18} />

              </div>


              <div className="location-box">

                <div className="location-placeholder">
                  <MapPin size={23} />
                </div>


                <div>

                  <strong>
                    {report.address ||
                      "Location captured"}
                  </strong>

                  <span>
                    Reported location
                  </span>

                </div>

              </div>

            </section>


            {/* ASSIGNMENT */}

            <section className="issue-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    Assigned department
                  </h2>

                  <p>
                    Responsible authority.
                  </p>

                </div>

                <UserRound size={18} />

              </div>


              <div className="department-box">

                <strong>
                  {report.department_name ||
                    "Not assigned yet"}
                </strong>

                <span>
                  Responsible department
                </span>

              </div>

            </section>


            {/* SUPPORT */}

            <section className="issue-help-card">

              <div className="help-icon">
                <MessageSquare size={18} />
              </div>


              <div>

                <h3>
                  Need help?
                </h3>

                <p>
                  If the information about this
                  report looks incorrect, contact
                  the CivicFix administration team.
                </p>

              </div>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default IssueDetails;