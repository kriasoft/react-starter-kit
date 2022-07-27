/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
/* @ts-ignore */
import createPalette from "@mui/material/styles/createPalette";
import { components } from "./components.js";
import * as palettes from "./palettes.js";
import * as typography from "./typography.js";

/**
 * Creates a customized Material UI theme
 * https://next.material-ui.com/customization/default-theme/
 */
function createCustomTheme(theme: PaletteMode) {
  const palette = createPalette(palettes[theme]);

  return createTheme(
    {
      palette: palettes[theme],
      typography: typography.options,
      components: components(palette),
    },
    {
      typography: typography.overrides,
    }
  );
}

export const light = createCustomTheme("light");
export const dark = createCustomTheme("dark");
