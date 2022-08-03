/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { atom, selector, useRecoilCallback, useRecoilValue } from "recoil";
import { components } from "./components.js";
import palettes from "./palettes.js";
import * as typography from "./typography.js";

/**
 * The name of the selected UI theme.
 */
export const ThemeName = atom<PaletteMode>({
  key: "ThemeName",
  effects: [
    (ctx) => {
      const storageKey = "theme";

      if (ctx.trigger === "get") {
        const name: PaletteMode =
          localStorage?.getItem(storageKey) === "dark"
            ? "dark"
            : localStorage?.getItem(storageKey) === "light"
            ? "light"
            : matchMedia?.("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        ctx.setSelf(name);
      }

      ctx.onSet((value) => {
        localStorage?.setItem(storageKey, value);
      });
    },
  ],
});

/**
 * The customized Material UI theme.
 * @see https://next.material-ui.com/customization/default-theme/
 */
export const Theme = selector({
  key: "Theme",
  dangerouslyAllowMutability: true,
  get(ctx) {
    const name = ctx.get(ThemeName);
    const { palette } = createTheme({ palette: palettes[name] });
    return createTheme(
      {
        palette,
        typography: typography.options,
        components: components(palette),
      },
      {
        typography: typography.overrides,
      }
    );
  },
});

/**
 * The auto-detected OR user selected Material UI theme.
 */
export function useTheme() {
  return useRecoilValue(Theme);
}

/**
 * Switches between "light" and "dark" themes.
 */
export function useToggleTheme() {
  return useRecoilCallback(
    (ctx) => () => {
      ctx.set(ThemeName, (prev) => (prev === "dark" ? "light" : "dark"));
    },
    []
  );
}
