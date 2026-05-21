import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./App";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

import "./index.css";

function Root() {

  const isAdmin =
    localStorage.getItem(
      "isAdmin"
    ) === "true";

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/admin"
          element={
            isAdmin
              ? (
                <AdminDashboard />
              )
              : (
                <AdminLogin
                  setIsAdmin={() =>
                    window.location.reload()
                  }
                />
              )
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <Root />

  </React.StrictMode>
);