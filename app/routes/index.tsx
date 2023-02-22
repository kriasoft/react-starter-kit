/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout.js";
import { BaseLayout } from "../layout/BaseLayout.js";
import { RootError } from "../layout/RootError.js";

const Login = lazy(() => import("./auth/Login.js"));
const Privacy = lazy(() => import("./legal/Privacy.js"));
const Terms = lazy(() => import("./legal/Terms.js"));

const Dashboard = lazy(() => import("./dashboard/Dashboard.js"));

const SettingsLayout = lazy(() => import("./settings/SettingsLayout.js"));
const AccountDetails = lazy(() => import("./settings/AccountDetails.js"));

/**
 * Application routes
 * https://reactrouter.com/en/main/routers/create-browser-router
 */
export const router = createBrowserRouter([
  {
    path: "",
    element: <BaseLayout />,
    errorElement: <RootError />,
    children: [
      { path: "login", element: <Login mode="login" /> },
      { path: "signup", element: <Login mode="signup" /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
    ],
  },
  {
    path: "",
    element: <AppLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [{ path: "account", element: <AccountDetails /> }],
      },
    ],
  },
]);

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
