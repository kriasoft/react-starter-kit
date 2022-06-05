/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Route } from "../core";
import { type Privacy } from "./LegalPrivacy";
import { type Terms } from "./LegalTerms";

export default [
  {
    path: "/privacy",
    component: () => import(/* webpackChunkName: "legal" */ "./LegalPrivacy"),
    response: () => ({
      title: "Privacy Policy",
    }),
  } as Route<Privacy>,

  {
    path: "/terms",
    component: () => import(/* webpackChunkName: "legal" */ "./LegalTerms"),
    response: () => ({
      title: "Terms of Use",
    }),
  } as Route<Terms>,
];
