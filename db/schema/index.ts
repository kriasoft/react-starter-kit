/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as invitation from "./invitation";
import * as organization from "./organization";
import * as team from "./team";
import * as user from "./user";

export const schema = {
  ...invitation,
  ...organization,
  ...team,
  ...user,
} as const;

export type DbSchema = typeof schema;
export default schema;
