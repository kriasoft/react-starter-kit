/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Layout } from "@/components/layout";

export const Route = createRootRoute({
  component: Root,
});

export function Root() {
  return (
    <Layout>
      <Outlet />
      <TanStackRouterDevtools />
    </Layout>
  );
}
