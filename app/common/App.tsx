/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssBaseline, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { AppRoutes } from "../routes/index.js";
import { useTheme } from "../theme/index.js";

import { ErrorBoundary } from "./ErrorBoundary.js";

/**
 * The top-level (root) React component.
 */
export function App(): JSX.Element {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <ErrorBoundary>
          <CssBaseline />
          <AppRoutes />
        </ErrorBoundary>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
