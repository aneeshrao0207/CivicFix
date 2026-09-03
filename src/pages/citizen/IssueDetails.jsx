import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  UserRound,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import "./IssueDetails.css";

const reports = {
  "CF-1024": {
    id: "CF-1024",
    title: "Large pothole near Main Road",
    category: "Road",
    description:
      "There is a large pothole near the bus stop causing difficulty for two-wheelers and other vehicles.",
    location: "Main Road, Bengaluru",
    date: "September 2, 2026",
    priority: "HIGH",
    status: "IN_PROGRESS",
    department: "Road Maintenance",

    timeline: [
      {
        title: "Report submitted",
        description: "Your report was successfully received by CivicFix.",
        time: "10:32 AM",
        completed: true,
      },
      {
        title: "Report reviewed",
        description: "The issue was reviewed by the municipal authority.",
        time: "11:15 AM",
        completed: true,
      },
      {
        title: "Assigned to Road Maintenance",
        description:
          "The report has been assigned to the responsible department.",
        time: "12:10 PM",
        completed: true,
      },
      {
        title: "Work in progress",
        description:
          "The responsible department is currently working on the issue.",
        time: "Today",
        completed: true,
        active: true,
      },
      {
        title: "Issue resolved",
        description:
          "The issue will be marked resolved after the work is completed.",
        time: "",
        completed: false,
      },
    ],
  },

  "CF-1021": {
    id: "CF-1021",
    title: "Broken streetlight near bus stop",
    category: "Streetlight",
    description:
      "The streetlight near the bus stop is not functioning during the evening.",
    location: "MG Road, Bengaluru",
    date: "September 1, 2026",
    priority: "MEDIUM",
    status: "UNDER_REVIEW",
    department: "Electrical / Street Lighting",

    timeline: [
      {
        title: "Report submitted",
        description: "Your report was successfully received by CivicFix.",
        time: "4:20 PM",
        completed: true,
      },
      {
        title: "Under review",
        description:
          "The municipal authority is reviewing the reported issue.",
        time: "5:05 PM",
        completed: true,
        active: true,
      },
      {
        title: "Assigned to department",
        description: "The responsible department has not yet been assigned.",
        time: "",
        completed: false,
      },
      {
        title: "Work in progress",
        description: "Work will begin after the issue is assigned.",
        time: "",
        completed: false,
      },
      {
        title: "Issue resolved",
        description: "The issue will appear here once resolved.",
        time: "",
        completed: false,
      },
    ],
  },
};

function IssueDetails() {
  const { id } = useParams();

  const report = reports[id] || reports["CF-1024"];

  return (
    <div className="citizen-issue-page">

      {/* TOP BAR */}

      <div className="issue-topbar">

        <Link
          to="/citizen/reports"
          className="back-link"
        >
          <ArrowLeft size={16} />
          Back to My Reports
        </Link>

        <span className="issue-reference">
          {report.id}
        </span>

      </div>

      <main className="issue-details-container">

        {/* HEADER */}

        <section className="issue-details-header">

          <div>

            <div className="issue-header-meta">

              <span className="issue-category">
                {report.category}
              </span>

              <span className="issue-dot">•</span>

              <span>
                Reported {report.date}
              </span>

            </div>

            <h1>{report.title}</h1>

            <p>
              {report.description}
            </p>

          </div>

          <div className="issue-current-status">
            <span>Current status</span>

            <strong>
              {report.status === "IN_PROGRESS"
                ? "In Progress"
                : "Under Review"}
            </strong>
          </div>

        </section>

        {/* CONTENT */}

        <div className="issue-details-grid">

          {/* LEFT */}

          <div className="issue-main-column">

            {/* TIMELINE */}

            <section className="issue-panel">

              <div className="panel-heading">
                <div>
                  <h2>Report timeline</h2>
                  <p>
                    Follow the progress of your report.
                  </p>
                </div>

                <Clock3 size={18} />
              </div>

              <div className="issue-timeline">

                {report.timeline.map((item) => (

                  <div
                    className={`timeline-item ${
                      item.active ? "active" : ""
                    }`}
                    key={item.title}
                  >

                    <div className="timeline-marker">

                      {item.completed ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <span />
                      )}

                    </div>

                    <div className="timeline-content">

                      <div className="timeline-title-row">

                        <h3>{item.title}</h3>

                        {item.time && (
                          <span>{item.time}</span>
                        )}

                      </div>

                      <p>
                        {item.description}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* DESCRIPTION */}

            <section className="issue-panel">

              <div className="panel-heading">

                <div>
                  <h2>Issue information</h2>
                  <p>
                    Details submitted with your report.
                  </p>
                </div>

                <FileText size={18} />

              </div>

              <div className="issue-information">

                <div>
                  <span>Description</span>
                  <p>{report.description}</p>
                </div>

                <div>
                  <span>Category</span>
                  <strong>{report.category}</strong>
                </div>

                <div>
                  <span>Priority</span>

                  <strong className="priority-high">
                    {report.priority}
                  </strong>
                </div>

              </div>

            </section>

          </div>

          {/* RIGHT */}

          <aside className="issue-side-column">

            {/* LOCATION */}

            <section className="issue-panel">

              <div className="panel-heading">

                <div>
                  <h2>Location</h2>
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
                  <strong>{report.location}</strong>

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
                  <h2>Assigned department</h2>
                  <p>
                    Responsible authority.
                  </p>
                </div>

                <UserRound size={18} />

              </div>

              <div className="department-box">
                <strong>{report.department}</strong>

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

                <h3>Need help?</h3>

                <p>
                  If the information about this report
                  looks incorrect, contact the CivicFix
                  administration team.
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