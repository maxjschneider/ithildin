import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import AuthenticationForm from "./components/AuthenticationForm.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route path="/login" element={<AuthenticationForm />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/foo" element={<div> Hello world </div>} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
