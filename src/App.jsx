import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/landing/Landing";

import CitizenLogin from "./pages/auth/CitizenLogin";
import CitizenRegister from "./pages/auth/CitizenRegister";
import AdminLogin from "./pages/auth/AdminLogin";

import CitizenLayout from "./pages/citizen/CitizenLayout";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import ReportIssue from "./pages/citizen/ReportIssue";
import MyReports from "./pages/citizen/MyReports";
import IssueDetails from "./pages/citizen/IssueDetails";
import CitizenNotifications from "./pages/citizen/CitizenNotifications";
import CitizenProfile from "./pages/citizen/CitizenProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminIssues from "./pages/admin/AdminIssues";
import AdminIssueDetails from "./pages/admin/AdminIssueDetails";
import AdminMap from "./pages/admin/AdminMap";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route path="/" element={<Landing />} />

        <Route
          path="/citizen/login"
          element={<CitizenLogin />}
        />

        <Route
          path="/citizen/register"
          element={<CitizenRegister />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =====================================================
            CITIZEN ROUTES
            Shared sidebar + navbar
        ===================================================== */}

        <Route element={<ProtectedRoute allowedRole="citizen" />}>
          <Route element={<CitizenLayout />}>

            <Route
              path="/citizen/dashboard"
              element={<CitizenDashboard />}
            />

            <Route
              path="/citizen/report"
              element={<ReportIssue />}
            />

            <Route
              path="/citizen/reports"
              element={<MyReports />}
            />

            <Route
              path="/citizen/reports/:id"
              element={<IssueDetails />}
            />

            <Route
              path="/citizen/notifications"
              element={<CitizenNotifications />}
            />

            <Route
              path="/citizen/profile"
              element={<CitizenProfile />}
            />

          </Route>
        </Route>


        {/* =====================================================
            ADMIN ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute allowedRole="admin" />}>

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/issues"
            element={<AdminIssues />}
          />

          <Route
            path="/admin/issues/:id"
            element={<AdminIssueDetails />}
          />

          <Route
            path="/admin/map"
            element={<AdminMap />}
          />

          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />

        </Route>


        {/* =====================================================
            FALLBACK
        ===================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;