/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { atom, useRecoilCallback, useRecoilValue } from "recoil";
import * as theme from "../theme/index.js";

const CurrentTheme = atom({
  key: "CurrentTheme",
  dangerouslyAllowMutability: true,
  default:
    localStorage?.getItem("theme") === "dark"
      ? theme.dark
      : localStorage?.getItem("theme") === "light"
      ? theme.light
      : matchMedia?.("(prefers-color-scheme: dark)").matches
      ? theme.dark
      : theme.light,
  effects: [
    (ctx) => {
      ctx.onSet(({ palette }) => {
        localStorage?.setItem("theme", palette.mode);
      });
    },
  ],
});

/**
 * The auto-detected OR user selected Material UI theme.
 */
export function useTheme() {
  return useRecoilValue(CurrentTheme);
}

/**
 * Switches between "light" and "dark" themes.
 */
export function useToggleTheme() {
  return useRecoilCallback(
    (ctx) => () => {
      ctx.set(CurrentTheme, ({ palette }) =>
        palette.mode === "dark" ? theme.light : theme.dark
      );
    },
    []
  );
}
