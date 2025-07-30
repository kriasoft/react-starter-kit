/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createAuthClient } from "better-auth/react";
import {
  anonymousClient,
  organizationClient,
} from "better-auth/client/plugins";

export const auth = createAuthClient({
  plugins: [anonymousClient(), organizationClient()],
});
