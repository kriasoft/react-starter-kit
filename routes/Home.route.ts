/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Route } from "../core";
import { type Home } from "./Home";

export default {
  path: "/",
  component: () => import(/* webpackChunkName: "home" */ "./Home"),
  response: () => ({
    title: "React App",
    description: "Web application built with React",
  }),
} as Route<Home>;
