// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import PermissionRoute from "./auth/PermissionRoute";

// PUBLIC PAGE
import HomePage from "./pages/HomePage";

// ADMIN PAGES
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Analytics from "./pages/admin/Analytics";
import Coupons from "./pages/admin/Coupons";
import Settings from "./pages/admin/Settings";

// LAZY
const AdminLogin = lazy(() =>
  import("./pages/admin/AdminLogin")
);

export default function App() {
  return (
    <Routes>
  {/* PUBLIC */}
  <Route path="/" element={<HomePage />} />

  {/* LOGIN */}
  <Route
    path="/admin/login"
    element={
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLogin />
      </Suspense>
    }
  />

  {/* ADMIN PANEL */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route
      path="dashboard"
      element={
        <PermissionRoute permission="dashboard:read">
          <Dashboard />
        </PermissionRoute>
      }
    />

    <Route
      path="users"
      element={
        <PermissionRoute permission="users:read">
          <Users />
        </PermissionRoute>
      }
    />

    <Route
      path="products"
      element={
        <PermissionRoute permission="products:read">
          <Products />
        </PermissionRoute>
      }
    />

    <Route
      path="orders"
      element={
        <PermissionRoute permission="orders:read">
          <Orders />
        </PermissionRoute>
      }
    />

    <Route
      path="coupons"
      element={
        <PermissionRoute permission="coupons:read">
          <Coupons />
        </PermissionRoute>
      }
    />

    <Route
      path="analytics"
      element={
        <PermissionRoute permission="analytics:read">
          <Analytics />
        </PermissionRoute>
      }
    />

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
  );
} 
