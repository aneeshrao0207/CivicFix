import { Navigate, Outlet } from "react-router-dom";
import {
  isAuthenticated,
  getUserRole,
} from "../services/auth";

function ProtectedRoute({ allowedRole }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const role = getUserRole();

  if (allowedRole && role !== allowedRole) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/citizen/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;