import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";

const App = lazy(() => import("./App"));

function Root() {
  console.log("Root rendered");

  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
              Loading...
            </div>
          }
        >
          <App />
        </Suspense>
      </AuthProvider>
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