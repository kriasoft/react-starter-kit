/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { GlobalStyles, Toolbar } from "@mui/material";
import * as React from "react";
import { Outlet } from "react-router-dom";
import { BaseToolbar } from "./components/BaseToolbar.js";

/**
 * The minimal app layout to be used on pages such Login/Signup,
 * Privacy Policy, Terms of Use, etc.
 */
export function BaseLayout(): JSX.Element {
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          "#root": {
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          },
        }}
      />

      <BaseToolbar />
      <Toolbar />

      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </React.Fragment>
  );
}
