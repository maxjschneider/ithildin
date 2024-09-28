import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { AuthenticationForm } from "./components/AuthenticationForm.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<AuthenticationForm />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/foo" element={<div> Hello world </div>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
