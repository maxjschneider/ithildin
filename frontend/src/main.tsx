import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import Home from "./components/Home.tsx";
import AuthenticationForm from "./components/AuthenticationForm.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import KeySetup from "./components/KeySetup.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route path="/login" element={<AuthenticationForm />} />
      <Route path="/keySetup" element={<KeySetup />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
