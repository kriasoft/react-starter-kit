/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Rewraper, VoidChildren } from "@archibara/react-rewraper";
import { StoreProvider } from "./core/store";
import { theme } from "./core/theme";
import { Router } from "./routes/index";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <Rewraper>
    <StrictMode />
    <CssVarsProvider theme={theme} />
    <SnackbarProvider />
    <CssBaseline />
    <StoreProvider children={VoidChildren} />
    <Router />
  </Rewraper>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}
