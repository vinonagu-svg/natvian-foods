import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  FiMenu,
  FiX,
  FiGrid,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiArchive,
  FiTag,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
  try {
    await signOut(auth);

    // ❌ REMOVE THIS (important)
    // localStorage.clear();

    // ❌ DON'T navigate manually
    // navigate("/admin/login");

  } catch (error) {
    console.error("Logout error:", error);
  }
};

  /* ================= NAV LINK STYLE ================= */
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  /* ================= SIDEBAR HEADER ================= */
  const SidebarHeader = ({ mobile }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <h1 className="font-bold text-lg">Admin</h1>

      {!mobile && (
        <button onClick={() => setCollapsed(!collapsed)}>
          <FiMenu />
        </button>
      )}

      {mobile && (
        <button onClick={() => setMobileOpen(false)}>
          <FiX />
        </button>
      )}
    </div>
  );

  /* ================= SIDEBAR NAV ================= */
  const SidebarNav = () => (
    <nav className="flex flex-col gap-2 p-3 flex-1">
      <NavLink to="/admin/dashboard" className={linkClass}>
        <FiGrid /> Dashboard
      </NavLink>

      <NavLink to="/admin/users" className={linkClass}>
        <FiUsers /> Users
      </NavLink>

      <NavLink to="/admin/categories" className={linkClass}>
        Categories
      </NavLink>

      <NavLink to="/admin/subcategories" className={linkClass}>
        Subcategories
      </NavLink>

      <NavLink to="/admin/products" className={linkClass}>
        <FiBox /> Products
      </NavLink>

      <NavLink to="/admin/orders" className={linkClass}>
        <FiShoppingCart /> Orders
      </NavLink>

      <NavLink to="/admin/archive" className={linkClass}>
  <FiArchive /> Archive
</NavLink>

      <NavLink to="/admin/coupons" className={linkClass}>
        <FiTag /> Coupons
      </NavLink>

      <NavLink to="/admin/analytics" className={linkClass}>
        <FiBarChart2 /> Analytics
      </NavLink>

      <NavLink to="/admin/settings" className={linkClass}>
        <FiSettings /> Settings
      </NavLink>
    </nav>
  );

  /* ================= SIDEBAR FOOTER ================= */
  const SidebarFooter = () => (
    <div className="p-3 border-t border-gray-800">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-400 hover:text-red-300"
      >
        <FiLogOut />
        Logout
      </button>
    </div>
  );

  /* ================= SIDEBAR WRAPPER ================= */
  const Sidebar = ({ mobile }) => (
    <>
      <SidebarHeader mobile={mobile} />
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
      <SidebarFooter />
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div
        className={`hidden md:flex flex-col bg-[#0f172a] text-white transition-all ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar mobile={false} />
      </div>

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 bg-[#0f172a] text-white items-center justify-between p-4 z-50">
        <h1 className="font-bold text-red-500">Admin Panel</h1>

        <button onClick={() => setMobileOpen(true)}>
          <FiMenu size={22} />
        </button>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-64 bg-[#0f172a] text-white h-screen flex flex-col z-50">
            <Sidebar mobile={true} />
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-6 overflow-auto md:ml-0 mt-16 md:mt-0">
        <Outlet />
      </div>
    </div>
  );
}