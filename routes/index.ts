/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import account from "./account";
import home from "./home";
import legal from "./legal";

/**
 * The list of application routes (pages).
 */
export default [home, account, ...legal] as const;
