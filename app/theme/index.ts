/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */
/* eslint import/namespace: ["error", { allowComputed: true }] */

import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { components } from "./components.js";
import * as palettes from "./palettes.js";
import * as typography from "./typography.js";

/**
 * Creates a customized Material UI theme
 * https://next.material-ui.com/customization/default-theme/
 */
function createCustomTheme(theme: PaletteMode) {
  const { palette } = createTheme({ palette: palettes[theme] });

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
