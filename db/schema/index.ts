/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as organization from "./organization";
import * as user from "./user";

export const schema = {
  ...organization,
  ...user,
} as const;

export type DbSchema = typeof schema;
export default schema;
