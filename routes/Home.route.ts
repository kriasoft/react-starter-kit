/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { graphql } from "relay-runtime";
import { type Route } from "../core";
import { type HomeQuery } from "../queries/HomeQuery.graphql";
import { type Home } from "./Home";

export default {
  path: "/",
  query: graphql`
    query HomeQuery {
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
    title: "React App",
    description: "Web application built with React and Relay",
    props: data,
  }),
} as Route<Home, HomeQuery>;
