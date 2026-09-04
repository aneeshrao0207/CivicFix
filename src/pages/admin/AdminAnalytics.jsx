import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { apiRequest } from "../../services/api";

import "./AdminAnalytics.css";


// ============================================
// CONSTANTS
// ============================================

const statusLabels = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

const categoryLabels = [
  "Road",
  "Garbage",
  "Streetlight",
  "Water",
  "Traffic",
  "Infrastructure",
  "Public Infrastructure",
  "Other",
];

const statusOrder = [
  "REPORTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
];

const priorityOrder = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const COLORS = [
  "#2563eb",
  "#8b5cf6",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#64748b",
];


// ============================================
// MAIN COMPONENT
// ============================================

function AdminAnalytics() {
  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ============================================
  // FETCH ISSUES
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
          "Failed to fetch analytics:",
          fetchError
        );

        setError(
          fetchError.message ||
            "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);


  // ============================================
  // BASIC KPI CALCULATIONS
  // ============================================

  const totalIssues = issues.length;

  const resolvedIssues = issues.filter(
    (issue) =>
      issue.status === "RESOLVED"
  ).length;

  const activeIssues = issues.filter(
    (issue) =>
      issue.status !== "RESOLVED" &&
      issue.status !== "REJECTED"
  ).length;

  const criticalIssues = issues.filter(
    (issue) =>
      issue.priority === "CRITICAL"
  ).length;

  const resolutionRate =
    totalIssues > 0
      ? Math.round(
          (resolvedIssues / totalIssues) * 100
        )
      : 0;


  // ============================================
  // CATEGORY DATA
  // ============================================

  const categoryData = useMemo(() => {
    return categoryLabels
      .map((category) => ({
        name: category,
        value: issues.filter(
          (issue) =>
            issue.category === category
        ).length,
      }))
      .filter((item) => item.value > 0);
  }, [issues]);


  // ============================================
  // STATUS DATA
  // ============================================

  const statusData = useMemo(() => {
    return statusOrder.map((status) => ({
      name:
        statusLabels[status] ||
        status,
      value: issues.filter(
        (issue) =>
          issue.status === status
      ).length,
    }));
  }, [issues]);


  // ============================================
  // PRIORITY DATA
  // ============================================

  const priorityData = useMemo(() => {
    return priorityOrder.map((priority) => ({
      name: priority,
      value: issues.filter(
        (issue) =>
          issue.priority === priority
      ).length,
    }));
  }, [issues]);


  // ============================================
  // 7 DAY TREND
  // ============================================

  const trendData = useMemo(() => {
    const today = new Date();

    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);

      date.setHours(0, 0, 0, 0);

      date.setDate(
        today.getDate() - i
      );

      days.push(date);
    }

    return days.map((date) => {
      const dayIssues = issues.filter(
        (issue) => {
          if (!issue.created_at) {
            return false;
          }

          const issueDate =
            new Date(issue.created_at);

          return (
            issueDate.getFullYear() ===
              date.getFullYear() &&
            issueDate.getMonth() ===
              date.getMonth() &&
            issueDate.getDate() ===
              date.getDate()
          );
        }
      ).length;

      return {
        day: date.toLocaleDateString(
          "en-IN",
          {
            weekday: "short",
          }
        ),
        issues: dayIssues,
      };
    });
  }, [issues]);


  // ============================================
  // DEPARTMENT DATA
  // ============================================

  const departmentData = useMemo(() => {
    const departments = {};

    issues.forEach((issue) => {
      const department =
        issue.department_name ||
        issue.department ||
        "Unassigned";

      if (!departments[department]) {
        departments[department] = {
          name: department,
          active: 0,
          resolved: 0,
        };
      }

      if (issue.status === "RESOLVED") {
        departments[department].resolved += 1;
      } else {
        departments[department].active += 1;
      }
    });

    return Object.values(departments);
  }, [issues]);


  // ============================================
  // MOST REPORTED CATEGORY
  // ============================================

  const topCategory = useMemo(() => {
    if (categoryData.length === 0) {
      return "No data";
    }

    return [...categoryData].sort(
      (a, b) =>
        b.value - a.value
    )[0]?.name || "No data";
  }, [categoryData]);


  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="analytics-page">

        <div className="admin-issues-loading">

          <LoaderCircle
            size={26}
            className="loading-spinner"
          />

          <strong>
            Loading analytics...
          </strong>

          <p>
            Analyzing civic reports from the database.
          </p>

        </div>

      </div>
    );
  }


  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="analytics-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="analytics-header">

        <div>

          <div className="analytics-eyebrow">

            <BarChart3 size={13} />

            CIVIC OPERATIONS

          </div>

          <h1>
            Analytics
          </h1>

          <p>
            Understand issue patterns, workload and
            resolution performance.
          </p>

        </div>

        <div className="analytics-period">

          <Activity size={13} />

          Last 7 days

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
              Unable to load analytics
            </strong>

            <p>
              {error}
            </p>

          </div>

        </div>
      )}


      {/* =====================================
          KPI CARDS
      ===================================== */}

      <section className="analytics-kpis">

        {/* TOTAL */}

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon">

            <FileText size={16} />

          </div>

          <div>

            <span>
              Total issues
            </span>

            <strong>
              {totalIssues}
            </strong>

            <small>
              All reported issues
            </small>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon blue">

            <Clock3 size={16} />

          </div>

          <div>

            <span>
              Active issues
            </span>

            <strong>
              {activeIssues}
            </strong>

            <small>
              Require attention
            </small>

          </div>

        </div>


        {/* RESOLUTION */}

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon green">

            <CheckCircle2 size={16} />

          </div>

          <div>

            <span>
              Resolution rate
            </span>

            <strong>
              {resolutionRate}%
            </strong>

            <small>
              Successfully resolved
            </small>

          </div>

        </div>


        {/* CRITICAL */}

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon red">

            <AlertTriangle size={16} />

          </div>

          <div>

            <span>
              Critical issues
            </span>

            <strong>
              {criticalIssues}
            </strong>

            <small>
              Need urgent attention
            </small>

          </div>

        </div>

      </section>


      {/* =====================================
          MAIN GRID
      ===================================== */}

      <section className="analytics-grid">


        {/* =================================
            CATEGORY
        ================================= */}

        <div className="analytics-card category-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Issues by category
              </h2>

              <p>
                Distribution of reported civic issues
              </p>

            </div>

          </div>


          <div className="analytics-chart">

            {categoryData.length === 0 ? (

              <div className="analytics-empty">
                No category data available.
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={categoryData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#2563eb"
                    radius={[
                      4,
                      4,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>


        {/* =================================
            STATUS
        ================================= */}

        <div className="analytics-card status-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Issue status
              </h2>

              <p>
                Current lifecycle distribution
              </p>

            </div>

          </div>


          <div className="analytics-pie-layout">

            <div className="analytics-pie">

              {totalIssues === 0 ? (

                <div className="analytics-empty">
                  No issues
                </div>

              ) : (

                <>

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={85}
                        paddingAngle={3}
                      >

                        {statusData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                COLORS[
                                  index %
                                    COLORS.length
                                ]
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>


                  <div className="analytics-pie-center">

                    <strong>
                      {totalIssues}
                    </strong>

                    <span>
                      Issues
                    </span>

                  </div>

                </>

              )}

            </div>


            <div className="analytics-legend">

              {statusData.map(
                (item, index) => (

                  <div
                    key={item.name}
                    className="analytics-legend-item"
                  >

                    <span
                      style={{
                        background:
                          COLORS[
                            index %
                              COLORS.length
                          ],
                      }}
                    />

                    <span>
                      {item.name}
                    </span>

                    <strong>
                      {item.value}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </div>


        {/* =================================
            TREND
        ================================= */}

        <div className="analytics-card trend-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Reported issues
              </h2>

              <p>
                Number of new issues reported each day
              </p>

            </div>

            <div className="analytics-trend">

              <TrendingUp size={13} />

              7 day trend

            </div>

          </div>


          <div className="analytics-chart trend-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={trendData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="issues"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* =================================
            PRIORITY
        ================================= */}

        <div className="analytics-card priority-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Priority distribution
              </h2>

              <p>
                Severity of current reports
              </p>

            </div>

          </div>


          <div className="priority-list">

            {priorityData.map(
              (item) => {

                const percentage =
                  totalIssues > 0
                    ? Math.round(
                        (item.value /
                          totalIssues) *
                          100
                      )
                    : 0;

                return (

                  <div
                    className="priority-row"
                    key={item.name}
                  >

                    <div className="priority-label">

                      <span
                        className={`priority-dot ${item.name.toLowerCase()}`}
                      />

                      <span>
                        {item.name}
                      </span>

                      <strong>
                        {item.value}
                      </strong>

                    </div>


                    <div className="priority-bar">

                      <div
                        className={`priority-bar-fill ${item.name.toLowerCase()}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================
          DEPARTMENT
      ===================================== */}

      <section className="analytics-card department-card">

        <div className="analytics-card-header">

          <div>

            <h2>
              Department workload
            </h2>

            <p>
              Active and resolved issues by responsible department
            </p>

          </div>

        </div>


        <div className="analytics-department-chart">

          {departmentData.length === 0 ? (

            <div className="analytics-empty">
              No department data available.
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={departmentData}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 20,
                  left: 20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{
                    fontSize: 8,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="active"
                  name="Active"
                  fill="#2563eb"
                  radius={[
                    0,
                    3,
                    3,
                    0,
                  ]}
                />

                <Bar
                  dataKey="resolved"
                  name="Resolved"
                  fill="#22c55e"
                  radius={[
                    0,
                    3,
                    3,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          )}

        </div>

      </section>


      {/* =====================================
          INSIGHT
      ===================================== */}

      <section className="analytics-insight">

        <div className="analytics-insight-icon">

          <TrendingUp size={16} />

        </div>

        <div>

          <strong>
            Operational insight
          </strong>

          <p>

            {totalIssues === 0
              ? "Analytics insights will appear once civic reports are submitted."
              : `${topCategory} is currently the most reported issue category. ${
                  criticalIssues > 0
                    ? `${criticalIssues} critical issue${
                        criticalIssues !== 1
                          ? "s"
                          : ""
                      } require${
                        criticalIssues === 1
                          ? "s"
                          : ""
                      } urgent attention.`
                    : "No critical issues are currently reported."
                }`}

          </p>

        </div>

      </section>

    </div>
  );
}


export default AdminAnalytics;