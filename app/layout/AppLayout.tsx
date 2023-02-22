/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Toolbar } from "@mui/material";
import * as React from "react";
import { Outlet } from "react-router-dom";
import { AppToolbar } from "./components/AppToolbar.js";

/**
 * The primary application layout.
 */
export function AppLayout(): JSX.Element {
  return (
    <React.Fragment>
      <AppToolbar />
      <Toolbar />

      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </React.Fragment>
  );
}
