/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as invitation from "./invitation";
import * as organization from "./organization";
import * as passkey from "./passkey";
import * as team from "./team";
import * as user from "./user";

export const schema = {
  ...invitation,
  ...organization,
  ...passkey,
  ...team,
  ...user,
} as const;

export type DbSchema = typeof schema;
export default schema;
