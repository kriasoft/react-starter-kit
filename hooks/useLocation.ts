/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { Location, LocationContext } from "../core/history";

export function useLocation(): Location {
  return React.useContext(LocationContext);
}
