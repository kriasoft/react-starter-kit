/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout.js";
import { BaseLayout } from "../layout/BaseLayout.js";

const Login = lazy(() => import("./auth/Login.js"));
const Privacy = lazy(() => import("./legal/Privacy.js"));
const Terms = lazy(() => import("./legal/Terms.js"));

const Dashboard = lazy(() => import("./dashboard/Dashboard.js"));

const SettingsLayout = lazy(() => import("./settings/SettingsLayout.js"));
const AccountDetails = lazy(() => import("./settings/AccountDetails.js"));

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/signup" element={<Login mode="signup" />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<SettingsLayout />}>
          <Route path="/account" element={<AccountDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}
