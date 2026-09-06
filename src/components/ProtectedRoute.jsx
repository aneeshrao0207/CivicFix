import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
  const location = useLocation();

  const token = localStorage.getItem("civicfix_token");
  const userData = localStorage.getItem("civicfix_user");

  // User is not logged in
  if (!token || !userData) {
    if (allowedRole === "admin") {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }

    return <Navigate to="/citizen/login" replace state={{ from: location }} />;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch {
    // Invalid stored user data
    localStorage.removeItem("civicfix_token");
    localStorage.removeItem("civicfix_user");

    return <Navigate to="/" replace />;
  }

  // Logged-in user has the wrong role
  if (user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "citizen") {
      return <Navigate to="/citizen/dashboard" replace />;
    }

    // Unknown role
    localStorage.removeItem("civicfix_token");
    localStorage.removeItem("civicfix_user");

    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the correct role
  return <Outlet />;
}

export default ProtectedRoute;