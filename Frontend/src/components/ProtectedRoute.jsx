import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if user is logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed (if allowedRoles is specified)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "recruiter") {
      return <Navigate to="/recruiter" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
