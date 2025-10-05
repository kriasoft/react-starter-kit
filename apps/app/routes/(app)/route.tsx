/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Layout } from "@/components/layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
  // AUTHENTICATION DISABLED FOR DEMO
  // Removed auth requirements to allow direct access to movie functionality
  // for technical interview purposes
  component: AppLayout,
});

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
