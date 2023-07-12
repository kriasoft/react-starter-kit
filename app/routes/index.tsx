/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout.js";
import { BaseLayout } from "../layout/BaseLayout.js";
import { RootError } from "../layout/RootError.js";

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
      { path: "login", lazy: () => import("./auth/Login.js") },
      { path: "signup", lazy: () => import("./auth/Login.js") },
      { path: "privacy", lazy: () => import("./legal/Privacy.js") },
      { path: "terms", lazy: () => import("./legal/Terms.js") },
    ],
  },
  {
    path: "",
    element: <AppLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", lazy: () => import("./dashboard/Dashboard.js") },
      {
        path: "settings",
        lazy: () => import("./settings/SettingsLayout.js"),
        children: [
          { index: true, element: <Navigate to="/settings/account" /> },
          {
            path: "account",
            lazy: () => import("./settings/AccountDetails.js"),
          },
        ],
      },
    ],
  },
]);

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
