import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permissions";

const PermissionRoute = ({ children, permission }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  if (permission && !hasPermission(user, permission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default PermissionRoute;