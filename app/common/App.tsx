/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginDialog } from "../dialogs/LoginDialog.js";
import { Home, Privacy, Settings, Terms } from "../routes/index.js";
import { useTheme } from "../theme/index.js";
import { AppToolbar } from "./AppToolbar.js";
import { ErrorBoundary } from "./ErrorBoundary.js";

export function App(): JSX.Element {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AppToolbar />
        <Toolbar />

        <Routes>
          <Route index element={<React.Suspense children={<Home />} />} />

          <Route
            path="/privacy"
            element={<React.Suspense children={<Privacy />} />}
          />

          <Route
            path="/terms"
            element={<React.Suspense children={<Terms />} />}
          />

          <Route
            path="/settings"
            element={<React.Suspense children={<Settings />} />}
          />
        </Routes>

        <LoginDialog />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
