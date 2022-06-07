/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type PaletteMode, type Theme } from "@mui/material";
import cookies from "js-cookie";
import * as React from "react";
import * as theme from "../theme";

const themeCookieKey = "th";

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
const ToggleThemeContext = React.createContext(() => {});

function detectTheme(): Theme {
  const cookie = cookies.get(themeCookieKey);
  return cookie === "d"
    ? theme.dark
    : cookie === "l"
    ? theme.light
    : window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ? theme.dark
    : theme.light /* default */;
}

function saveTheme(mode: PaletteMode): void {
  cookies.set(
    themeCookieKey,
    mode === theme.dark.palette.mode
      ? "d"
      : mode === theme.light.palette.mode
      ? "l"
      : ""
  );
}

function useToggleTheme(): () => void {
  return React.useContext(ToggleThemeContext);
}

export { ToggleThemeContext, useToggleTheme, detectTheme, saveTheme };
