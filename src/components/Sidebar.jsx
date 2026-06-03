import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permissions";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div>
      <a href="/">Dashboard</a>

      {hasPermission(user, "products:read") && (
        <a href="/products">Products</a>
      )}

      {hasPermission(user, "users:read") && (
        <a href="/users">Users</a>
      )}
    </div>
  );
}