import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
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

import "./AdminAnalytics.css";

const issues = [
  {
    id: "CF-1024",
    category: "Road",
    department: "Road Maintenance",
    priority: "HIGH",
    status: "IN_PROGRESS",
  },
  {
    id: "CF-1023",
    category: "Streetlight",
    department: "Electrical",
    priority: "MEDIUM",
    status: "UNDER_REVIEW",
  },
  {
    id: "CF-1022",
    category: "Garbage",
    department: "Waste Management",
    priority: "HIGH",
    status: "ASSIGNED",
  },
  {
    id: "CF-1021",
    category: "Water",
    department: "Water Supply",
    priority: "CRITICAL",
    status: "REPORTED",
  },
  {
    id: "CF-1020",
    category: "Infrastructure",
    department: "Road Maintenance",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
  },
  {
    id: "CF-1019",
    category: "Traffic",
    department: "Traffic Department",
    priority: "CRITICAL",
    status: "RESOLVED",
  },
  {
    id: "CF-1018",
    category: "Garbage",
    department: "Waste Management",
    priority: "LOW",
    status: "RESOLVED",
  },
];

const statusLabels = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

const categoryLabels = [
  "Road",
  "Garbage",
  "Streetlight",
  "Water",
  "Traffic",
  "Infrastructure",
];

function countBy(field, values) {
  return values.map((value) => ({
    name: value,
    value: issues.filter(
      (issue) => issue[field] === value
    ).length,
  }));
}

const categoryData = countBy("category", categoryLabels);

const statusData = [
  "REPORTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
].map((status) => ({
  name: statusLabels[status],
  value: issues.filter(
    (issue) => issue.status === status
  ).length,
}));

const priorityData = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
].map((priority) => ({
  name: priority,
  value: issues.filter(
    (issue) => issue.priority === priority
  ).length,
}));

const trendData = [
  { day: "Mon", issues: 4 },
  { day: "Tue", issues: 7 },
  { day: "Wed", issues: 5 },
  { day: "Thu", issues: 9 },
  { day: "Fri", issues: 6 },
  { day: "Sat", issues: 8 },
  { day: "Sun", issues: 5 },
];

const departmentData = [
  {
    name: "Road Maintenance",
    active: issues.filter(
      (issue) =>
        issue.department === "Road Maintenance" &&
        issue.status !== "RESOLVED"
    ).length,
    resolved: issues.filter(
      (issue) =>
        issue.department === "Road Maintenance" &&
        issue.status === "RESOLVED"
    ).length,
  },
  {
    name: "Waste Management",
    active: issues.filter(
      (issue) =>
        issue.department === "Waste Management" &&
        issue.status !== "RESOLVED"
    ).length,
    resolved: issues.filter(
      (issue) =>
        issue.department === "Waste Management" &&
        issue.status === "RESOLVED"
    ).length,
  },
  {
    name: "Electrical",
    active: issues.filter(
      (issue) =>
        issue.department === "Electrical" &&
        issue.status !== "RESOLVED"
    ).length,
    resolved: issues.filter(
      (issue) =>
        issue.department === "Electrical" &&
        issue.status === "RESOLVED"
    ).length,
  },
  {
    name: "Water Supply",
    active: issues.filter(
      (issue) =>
        issue.department === "Water Supply" &&
        issue.status !== "RESOLVED"
    ).length,
    resolved: issues.filter(
      (issue) =>
        issue.department === "Water Supply" &&
        issue.status === "RESOLVED"
    ).length,
  },
  {
    name: "Traffic Department",
    active: issues.filter(
      (issue) =>
        issue.department === "Traffic Department" &&
        issue.status !== "RESOLVED"
    ).length,
    resolved: issues.filter(
      (issue) =>
        issue.department === "Traffic Department" &&
        issue.status === "RESOLVED"
    ).length,
  },
];

const COLORS = [
  "#2563eb",
  "#8b5cf6",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#64748b",
];

function AdminAnalytics() {
  const totalIssues = issues.length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "RESOLVED"
  ).length;

  const activeIssues = totalIssues - resolvedIssues;

  const criticalIssues = issues.filter(
    (issue) => issue.priority === "CRITICAL"
  ).length;

  const resolutionRate = Math.round(
    (resolvedIssues / totalIssues) * 100
  );

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <header className="analytics-header">

        <div>

          <div className="analytics-eyebrow">
            <BarChart3 size={13} />
            CIVIC OPERATIONS
          </div>

          <h1>Analytics</h1>

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

      {/* KPI CARDS */}

      <section className="analytics-kpis">

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon">
            <FileText size={16} />
          </div>

          <div>
            <span>Total issues</span>
            <strong>{totalIssues}</strong>
            <small>
              All reported issues
            </small>
          </div>

        </div>

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon blue">
            <Clock3 size={16} />
          </div>

          <div>
            <span>Active issues</span>
            <strong>{activeIssues}</strong>
            <small>
              Require attention
            </small>
          </div>

        </div>

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon green">
            <CheckCircle2 size={16} />
          </div>

          <div>
            <span>Resolution rate</span>
            <strong>{resolutionRate}%</strong>
            <small>
              Successfully resolved
            </small>
          </div>

        </div>

        <div className="analytics-kpi">

          <div className="analytics-kpi-icon red">
            <AlertTriangle size={16} />
          </div>

          <div>
            <span>Critical issues</span>
            <strong>{criticalIssues}</strong>
            <small>
              Need urgent attention
            </small>
          </div>

        </div>

      </section>

      {/* MAIN GRID */}

      <section className="analytics-grid">

        {/* CATEGORY */}

        <div className="analytics-card category-card">

          <div className="analytics-card-header">

            <div>
              <h2>Issues by category</h2>
              <p>
                Distribution of reported civic issues
              </p>
            </div>

          </div>

          <div className="analytics-chart">

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
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* STATUS */}

        <div className="analytics-card status-card">

          <div className="analytics-card-header">

            <div>
              <h2>Issue status</h2>
              <p>
                Current lifecycle distribution
              </p>
            </div>

          </div>

          <div className="analytics-pie-layout">

            <div className="analytics-pie">

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
                            COLORS[index]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

              <div className="analytics-pie-center">
                <strong>{totalIssues}</strong>
                <span>Issues</span>
              </div>

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
                          COLORS[index],
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
              <h2>Reported issues</h2>
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

        {/* PRIORITY */}

        <div className="analytics-card priority-card">

          <div className="analytics-card-header">

            <div>
              <h2>Priority distribution</h2>
              <p>
                Severity of current reports
              </p>
            </div>

          </div>

          <div className="priority-list">

            {priorityData.map((item) => {

              const percentage = Math.round(
                (item.value / totalIssues) *
                  100
              );

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
            })}

          </div>

        </div>

      </section>

      {/* DEPARTMENT */}

      <section className="analytics-card department-card">

        <div className="analytics-card-header">

          <div>
            <h2>Department workload</h2>

            <p>
              Active and resolved issues by responsible department
            </p>
          </div>

        </div>

        <div className="analytics-department-chart">

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
                radius={[0, 3, 3, 0]}
              />

              <Bar
                dataKey="resolved"
                name="Resolved"
                fill="#22c55e"
                radius={[0, 3, 3, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </section>

      {/* INSIGHT */}

      <section className="analytics-insight">

        <div className="analytics-insight-icon">
          <TrendingUp size={16} />
        </div>

        <div>

          <strong>
            Operational insight
          </strong>

          <p>
            Road-related issues currently represent
            the largest category of reports. Critical
            issues should be reviewed first to reduce
            public safety risks.
          </p>

        </div>

      </section>

    </div>
  );
}

export default AdminAnalytics;