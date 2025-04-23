/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NavigationDrawer, ToolsDrawer } from "../layout";
import { Content } from "../layout/content";
import { Header } from "../layout/header";
import { theme } from "../theme";

export const Route = createRootRoute({
  component: Root,
});

export function Root() {
  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline enableColorScheme />

      <Header />
      <Content />

      <NavigationDrawer />
      <ToolsDrawer />

      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
