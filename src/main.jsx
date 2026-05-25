import React, {
  Suspense,
  lazy,
} from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import "./index.css";

// =========================
// LAZY IMPORTS
// =========================
const App = lazy(() =>
  import("./App")
);

// =========================
// ROOT COMPONENT
// =========================
function Root() {

  return (

    <BrowserRouter>

      <Suspense
        fallback={

          <div className="min-h-screen flex items-center justify-center text-2xl font-bold">

            Loading...

          </div>
        }
      >

        <App />

      </Suspense>

    </BrowserRouter>
  );
}

// =========================
// RENDER APP
// =========================
ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <Root />

  </React.StrictMode>
);