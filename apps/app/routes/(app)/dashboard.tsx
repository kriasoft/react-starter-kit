/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
  beforeLoad: () => {
    // Redirect to index which is the main dashboard
    throw redirect({
      to: "/",
    });
  },
});
