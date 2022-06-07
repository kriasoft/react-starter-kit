/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Route } from "../core";
import { type Settings } from "./Settings";

export default {
  path: "/settings",
  component: () => import(/* webpackChunkName: "settings" */ "./Settings"),
  response: () => ({
    title: "Account Settings",
  }),
} as Route<Settings>;
