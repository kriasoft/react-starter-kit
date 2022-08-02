/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { PaletteOptions } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { components } from "./components.js";
import * as palettes from "./palettes.js";
import * as typography from "./typography.js";

/**
 * Creates a customized Material UI theme
 * https://next.material-ui.com/customization/default-theme/
 */
function createCustomTheme(paletteOptions: PaletteOptions) {
  const { palette } = createTheme({ palette: paletteOptions });

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
}

export const light = createCustomTheme(palettes.dark);
export const dark = createCustomTheme(palettes.light);
