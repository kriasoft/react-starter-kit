/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import {
  Action,
  type History as HistoryBase,
  type Location as LocationBase,
  type To,
} from "history";
import * as React from "react";

// Provide the default history object (for unit testing)
const HistoryContext = React.createContext<History>({
  action: Action.Pop,
  location: { key: "", pathname: "/", search: "" },
} as History);

// Provide the default location object (for unit testing)
const LocationContext = React.createContext<Location>({
  key: "",
  pathname: "/",
  search: "",
} as Location);

function useHistory(): History {
  return React.useContext(HistoryContext);
}

function useLocation(): Location {
  return React.useContext(LocationContext);
}

function isLeftClickEvent(event: React.MouseEvent<HTMLElement>) {
  return event.button === 0;
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function useNavigate<T extends HTMLElement = HTMLAnchorElement>(): (
  event: React.MouseEvent<T>
) => void {
  const history = useHistory();

  return React.useCallback(
    (event: React.MouseEvent<T>): void => {
      if (
        event.defaultPrevented ||
        isModifiedEvent(event) ||
        !isLeftClickEvent(event)
      ) {
        return;
      }

      event.preventDefault();
      history.push(event.currentTarget.getAttribute("href") as To);
    },
    [history]
  );
}

type History = HistoryBase;
type Location = LocationBase;

export {
  HistoryContext,
  LocationContext,
  useHistory,
  useLocation,
  useNavigate,
  type History,
  type Location,
};
