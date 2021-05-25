/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { graphql } from "relay-runtime";
import type { Route } from "../../core";
import type Home from "./Home";
import type { homeQueryResponse } from "./__generated__/homeQuery.graphql";

/**
 * Homepage route.
 */
export default {
  path: "/",
  query: graphql`
    query homeQuery {
      me {
        ...CurrentUser_me
        id
        name
        email
      }
    }
  `,
  component: () => import(/* webpackChunkName: "home" */ "./Home"),
  response: (data) => ({
    title: "Boilerplate • Online scaffolding tool for software projects",
    description: "Web application built with React and Relay",
    props: data,
  }),
} as Route<typeof Home, homeQueryResponse>;
