import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permissions";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  console.log("auth user =", user);
  console.log("auth loading =", loading);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/admin");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="w-64 h-screen bg-black text-white fixed p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-64 h-screen bg-black text-white fixed p-6">
      <h1 className="text-3xl font-bold mb-2">
        Natvian Admin
      </h1>

      <p className="text-sm text-gray-400 mb-10">
        {user?.name || "User"} ({user?.role || "staff"})
      </p>

      <div className="flex flex-col gap-5">
        {hasPermission(user, "dashboard:read") && (
          <Link to="/admin/dashboard">Dashboard</Link>
        )}

        {hasPermission(user, "users:read") && (
          <Link to="/admin/users">Users</Link>
        )}

        {hasPermission(user, "products:read") && (
          <Link to="/admin/products">Products</Link>
        )}

        {hasPermission(user, "orders:read") && (
          <Link to="/admin/orders">Orders</Link>
        )}

        {hasPermission(user, "analytics:read") && (
          <Link to="/admin/analytics">Analytics</Link>
        )}

        {hasPermission(user, "coupons:read") && (
          <Link to="/admin/coupons">Coupons</Link>
        )}

        {hasPermission(user, "settings:read") && (
          <Link to="/admin/settings">Settings</Link>
        )}

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 p-2 rounded mt-6"
        >
          Logout
        </button>
      </div>
    </div>
  );
}