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
  Building2,
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

const STATUS_LABELS = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

const STATUS_ORDER = [
  "REPORTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
];

const CATEGORY_ORDER = [
  "Road",
  "Garbage",
  "Streetlight",
  "Water",
  "Traffic",
  "Infrastructure",
  "Public Infrastructure",
  "Other",
];

const PRIORITY_ORDER = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const CHART_COLORS = [
  "#2563eb",
  "#8b5cf6",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#64748b",
];


// ============================================
// HELPERS
// ============================================

const formatDate = (date) => {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const normalizeCategory = (category) => {
  if (!category) return "Other";

  const value = String(category).trim();

  if (
    value.toLowerCase() === "public infrastructure"
  ) {
    return "Public Infrastructure";
  }

  const match = CATEGORY_ORDER.find(
    (item) =>
      item.toLowerCase() === value.toLowerCase()
  );

  return match || "Other";
};

const getDepartmentName = (issue) => {
  return (
    issue.department_name ||
    issue.department ||
    issue.assigned_department ||
    "Unassigned"
  );
};


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

  const fetchAnalytics = async () => {
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

  useEffect(() => {
    fetchAnalytics();
  }, []);


  // ============================================
  // KPI CALCULATIONS
  // ============================================

  const totalIssues = issues.length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "RESOLVED"
  ).length;

  const rejectedIssues = issues.filter(
    (issue) => issue.status === "REJECTED"
  ).length;

  const activeIssues = issues.filter(
    (issue) =>
      issue.status !== "RESOLVED" &&
      issue.status !== "REJECTED"
  ).length;

  const criticalIssues = issues.filter(
    (issue) => issue.priority === "CRITICAL"
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
    return CATEGORY_ORDER
      .map((category) => ({
        name: category,
        value: issues.filter(
          (issue) =>
            normalizeCategory(issue.category) ===
            category
        ).length,
      }))
      .filter((item) => item.value > 0);
  }, [issues]);


  // ============================================
  // STATUS DATA
  // ============================================

  const statusData = useMemo(() => {
    return STATUS_ORDER.map((status) => ({
      name: STATUS_LABELS[status],
      value: issues.filter(
        (issue) => issue.status === status
      ).length,
    }));
  }, [issues]);


  // ============================================
  // PRIORITY DATA
  // ============================================

  const priorityData = useMemo(() => {
    return PRIORITY_ORDER.map((priority) => ({
      name: priority,
      value: issues.filter(
        (issue) => issue.priority === priority
      ).length,
    }));
  }, [issues]);


  // ============================================
  // LAST 7 DAYS TREND
  // ============================================

  const trendData = useMemo(() => {
    const today = new Date();

    const days = [];

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);

      date.setHours(0, 0, 0, 0);
      date.setDate(
        today.getDate() - i
      );

      days.push(date);
    }

    return days.map((date) => {
      const count = issues.filter((issue) => {
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
      }).length;

      return {
        day: formatDate(date),
        issues: count,
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
        getDepartmentName(issue);

      if (!departments[department]) {
        departments[department] = {
          name: department,
          active: 0,
          resolved: 0,
          total: 0,
        };
      }

      departments[department].total += 1;

      if (issue.status === "RESOLVED") {
        departments[department].resolved += 1;
      } else {
        departments[department].active += 1;
      }
    });

    return Object.values(departments).sort(
      (a, b) => b.total - a.total
    );
  }, [issues]);


  // ============================================
  // TOP CATEGORY
  // ============================================

  const topCategory = useMemo(() => {
    if (!categoryData.length) {
      return "No data";
    }

    return [...categoryData].sort(
      (a, b) => b.value - a.value
    )[0]?.name || "No data";
  }, [categoryData]);


  // ============================================
  // HIGHEST PRIORITY
  // ============================================

  const highestPriority = useMemo(() => {
    const critical = priorityData.find(
      (item) => item.name === "CRITICAL"
    );

    if (critical?.value > 0) {
      return "Critical";
    }

    const high = priorityData.find(
      (item) => item.name === "HIGH"
    );

    if (high?.value > 0) {
      return "High";
    }

    return "Normal";
  }, [priorityData]);


  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="analytics-page">

        <div className="analytics-loading">

          <LoaderCircle
            size={28}
            className="analytics-loading-spinner"
          />

          <strong>
            Loading analytics
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

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="analytics-header">

        <div>

          <div className="analytics-eyebrow">

            <BarChart3 size={14} />

            CIVIC OPERATIONS

          </div>

          <h1>
            Analytics
          </h1>

          <p>
            Monitor civic issue patterns,
            workload and resolution performance.
          </p>

        </div>


        <button
          type="button"
          className="analytics-refresh"
          onClick={fetchAnalytics}
        >

          <Activity size={14} />

          Refresh data

        </button>

      </header>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="analytics-error">

          <AlertTriangle size={18} />

          <div>

            <strong>
              Unable to load analytics
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAnalytics}
            >
              Try again
            </button>

          </div>

        </div>

      )}


      {/* ======================================
          KPI SECTION
      ====================================== */}

      <section className="analytics-kpis">

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon">

            <FileText size={17} />

          </div>

          <div className="analytics-kpi-content">

            <span>
              Total issues
            </span>

            <strong>
              {totalIssues}
            </strong>

            <small>
              All submitted reports
            </small>

          </div>

        </div>


        <div className="analytics-kpi">

          <div className="analytics-kpi-icon blue">

            <Clock3 size={17} />

          </div>

          <div className="analytics-kpi-content">

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


        <div className="analytics-kpi">

          <div className="analytics-kpi-icon green">

            <CheckCircle2 size={17} />

          </div>

          <div className="analytics-kpi-content">

            <span>
              Resolution rate
            </span>

            <strong>
              {resolutionRate}%
            </strong>

            <small>
              {resolvedIssues} resolved
            </small>

          </div>

        </div>


        <div className="analytics-kpi">

          <div className="analytics-kpi-icon red">

            <AlertTriangle size={17} />

          </div>

          <div className="analytics-kpi-content">

            <span>
              Critical issues
            </span>

            <strong>
              {criticalIssues}
            </strong>

            <small>
              {criticalIssues > 0
                ? "Require urgent attention"
                : "No critical reports"}
            </small>

          </div>

        </div>

      </section>


      {/* ======================================
          QUICK INSIGHTS
      ====================================== */}

      <section className="analytics-insight-grid">

        <div className="analytics-mini-card">

          <div className="analytics-mini-icon blue">

            <TrendingUp size={15} />

          </div>

          <div>

            <span>
              Most reported category
            </span>

            <strong>
              {topCategory}
            </strong>

          </div>

        </div>


        <div className="analytics-mini-card">

          <div className="analytics-mini-icon orange">

            <AlertTriangle size={15} />

          </div>

          <div>

            <span>
              Highest active priority
            </span>

            <strong>
              {highestPriority}
            </strong>

          </div>

        </div>


        <div className="analytics-mini-card">

          <div className="analytics-mini-icon green">

            <CheckCircle2 size={15} />

          </div>

          <div>

            <span>
              Resolved reports
            </span>

            <strong>
              {resolvedIssues}
            </strong>

          </div>

        </div>


        <div className="analytics-mini-card">

          <div className="analytics-mini-icon purple">

            <Activity size={15} />

          </div>

          <div>

            <span>
              Rejected reports
            </span>

            <strong>
              {rejectedIssues}
            </strong>

          </div>

        </div>

      </section>


      {/* ======================================
          MAIN ANALYTICS GRID
      ====================================== */}

      <section className="analytics-grid">


        {/* CATEGORY */}

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
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--chart-grid)"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 10,
                      fill: "var(--chart-text)",
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 10,
                      fill: "var(--chart-text)",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    name="Issues"
                    fill="#2563eb"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>


        {/* STATUS */}

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
                        outerRadius={82}
                        paddingAngle={3}
                      >

                        {statusData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                CHART_COLORS[
                                  index %
                                    CHART_COLORS.length
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
                          CHART_COLORS[
                            index %
                              CHART_COLORS.length
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


        {/* TREND */}

        <div className="analytics-card trend-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Reporting trend
              </h2>

              <p>
                New civic reports received over the last 7 days
              </p>

            </div>

            <div className="analytics-trend">

              <TrendingUp size={13} />

              7 days

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
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--chart-grid)"
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fontSize: 10,
                    fill: "var(--chart-text)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 10,
                    fill: "var(--chart-text)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="issues"
                  name="Reports"
                  stroke="#2563eb"
                  strokeWidth={2.5}
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


        {/* PRIORITY */}

        <div className="analytics-card priority-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Priority distribution
              </h2>

              <p>
                Severity across all current reports
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

                      <div className="priority-name">

                        <span
                          className={`priority-dot ${item.name.toLowerCase()}`}
                        />

                        <span>
                          {item.name}
                        </span>

                      </div>

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


                    <small>
                      {percentage}% of reports
                    </small>

                  </div>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* ======================================
          DEPARTMENT PERFORMANCE
      ====================================== */}

      <section className="analytics-card department-card">

        <div className="analytics-card-header">

          <div>

            <div className="analytics-section-label">

              <Building2 size={13} />

              DEPARTMENT PERFORMANCE

            </div>

            <h2>
              Department workload
            </h2>

            <p>
              Active and resolved issues by responsible department
            </p>

          </div>

        </div>


        {departmentData.length === 0 ? (

          <div className="analytics-empty department-empty">
            No department data available.
          </div>

        ) : (

          <div className="department-table-wrapper">

            <table className="department-table">

              <thead>

                <tr>

                  <th>
                    Department
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Active
                  </th>

                  <th>
                    Resolved
                  </th>

                  <th>
                    Resolution
                  </th>

                </tr>

              </thead>


              <tbody>

                {departmentData.map(
                  (department) => {

                    const departmentRate =
                      department.total > 0
                        ? Math.round(
                            (department.resolved /
                              department.total) *
                              100
                          )
                        : 0;

                    return (

                      <tr
                        key={department.name}
                      >

                        <td>

                          <div className="department-name">

                            <div className="department-avatar">

                              <Building2 size={13} />

                            </div>

                            <strong>
                              {department.name}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {department.total}
                        </td>

                        <td>
                          <span className="department-active">
                            {department.active}
                          </span>
                        </td>

                        <td>
                          <span className="department-resolved">
                            {department.resolved}
                          </span>
                        </td>

                        <td>

                          <div className="department-rate">

                            <div className="department-rate-track">

                              <div
                                className="department-rate-fill"
                                style={{
                                  width: `${departmentRate}%`,
                                }}
                              />

                            </div>

                            <span>
                              {departmentRate}%
                            </span>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ======================================
          OPERATIONAL INSIGHT
      ====================================== */}

      <section className="analytics-insight">

        <div className="analytics-insight-icon">

          <TrendingUp size={17} />

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
                    ? `${criticalIssues} critical ${
                        criticalIssues === 1
                          ? "issue requires"
                          : "issues require"
                      } urgent attention.`
                    : "There are currently no critical issues requiring immediate attention."
                }`}

          </p>

        </div>

      </section>

    </div>
  );
}


export default AdminAnalytics;