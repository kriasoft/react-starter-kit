/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type Theme } from "@mui/material";
import * as React from "react";
import * as themes from "../theme/index.js";

const $ = {
  theme:
    localStorage?.getItem("theme") === "dark"
      ? themes.dark
      : localStorage?.getItem("theme") === "light"
      ? themes.light
      : matchMedia?.("(prefers-color-scheme: dark)").matches
      ? themes.dark
      : themes.light,
  callbacks: new Set<React.Dispatch<React.SetStateAction<Theme>>>(),
};

/**
 * The auto-detected OR user selected Material UI theme.
 */
export function useTheme() {
  const [theme, setTheme] = React.useState($.theme);

  React.useEffect(() => {
    $.callbacks.add(setTheme);
    return () => {
      $.callbacks.delete(setTheme);
    };
  }, []);

  return theme;
}

/**
 * Switches between "light" and "dark" themes.
 */
export function useToggleTheme() {
  return React.useCallback(() => {
    $.callbacks.forEach((setTheme) => {
      setTheme((prev) => {
        $.theme = prev.palette.mode === "dark" ? themes.light : themes.dark;
        localStorage?.setItem("theme", $.theme.palette.mode);
        return $.theme;
      });
    });
  }, []);
}
