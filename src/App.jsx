import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./auth/ProtectedRoute";
import PermissionRoute from "./auth/PermissionRoute";

// PUBLIC
import HomePage from "./pages/HomePage";

// ADMIN LAYOUT
import AdminLayout from "./pages/admin/AdminLayout";

// ADMIN PAGES
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Analytics from "./pages/admin/Analytics";
import Coupons from "./pages/admin/Coupons";
import Settings from "./pages/admin/Settings";
import Categories from "./pages/admin/Categories";
import Subcategories from "./pages/admin/Subcategories";

// LAZY
const AdminLogin = lazy(() =>
  import("./pages/admin/AdminLogin")
);

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
          Loading...
        </div>
      }
    >
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HomePage />} />

        {/* ================= ADMIN LOGIN (IMPORTANT - MUST EXIST) ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= ADMIN PROTECTED AREA ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* DEFAULT ROUTE */}
          <Route index element={<Dashboard />} />

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={
              <PermissionRoute permission="dashboard:read">
                <Dashboard />
              </PermissionRoute>
            }
          />

          {/* USERS */}
          <Route
            path="users"
            element={
              <PermissionRoute permission="users:read">
                <Users />
              </PermissionRoute>
            }
          />

          {/* PRODUCTS */}
          <Route
            path="products"
            element={
              <PermissionRoute permission="products:read">
                <Products />
              </PermissionRoute>
            }
          />

          {/* ORDERS */}
          <Route
            path="orders"
            element={
              <PermissionRoute permission="orders:read">
                <Orders />
              </PermissionRoute>
            }
          />

          {/* CATEGORIES */}
          <Route path="categories" element={<Categories />} />

          {/* SUBCATEGORIES */}
          <Route path="subcategories" element={<Subcategories />} />

          {/* COUPONS */}
          <Route
            path="coupons"
            element={
              <PermissionRoute permission="coupons:read">
                <Coupons />
              </PermissionRoute>
            }
          />

          {/* ANALYTICS */}
          <Route
            path="analytics"
            element={
              <PermissionRoute permission="analytics:read">
                <Analytics />
              </PermissionRoute>
            }
          />

          {/* SETTINGS */}
          <Route
            path="settings"
            element={
              <PermissionRoute permission="settings:read">
                <Settings />
              </PermissionRoute>
            }
          />
        </Route>

      </Routes>
    </Suspense>
  );
}