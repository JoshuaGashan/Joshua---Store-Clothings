// ============================================================
// 🚪 index.js — React Entry Point
// This is the very first file React runs.
// It finds the <div id="root"> in public/index.html
// and renders our entire App inside it.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
