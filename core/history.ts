/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { History as HistoryBase, Location as LocationBase } from "history";
import { Action } from "history";
import * as React from "react";

export type History = HistoryBase;
export type Location = LocationBase;

// Provide the default history object (for unit testing)
export const HistoryContext = React.createContext<History>({
  action: Action.Pop,
  location: { key: "", pathname: "/", search: "" },
} as History);

// Provide the default location object (for unit testing)
export const LocationContext = React.createContext<Location>({
  key: "",
  pathname: "/",
  search: "",
} as Location);
