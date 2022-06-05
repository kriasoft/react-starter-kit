/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { graphql } from "relay-runtime";
import { type Route } from "../core";
import { type SettingsQuery } from "../queries/SettingsQuery.graphql";
import { type Settings } from "./Settings";

export default {
  path: "/settings",
  query: graphql`
    query SettingsQuery {
      me {
        id
        email
        name
      }
    }
  `,
  component: () => import(/* webpackChunkName: "settings" */ "./Settings"),
  response: (data) => ({
    title: "Account Settings",
    props: data,
  }),
} as Route<Settings, SettingsQuery>;
