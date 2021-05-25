/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { History, HistoryContext } from "../core/history";

export function useHistory(): History {
  return React.useContext(HistoryContext);
}
