/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type PaletteOptions } from "@mui/material/styles";

export const light: PaletteOptions = {
  mode: "light",

  primary: {
    main: "rgb(24,119,242)",
  },

  background: {
    default: "rgb(240,242,245)",
  },

  example: {
    primary: "#49b4ff",
    secondary: "#ef3054",
  },
};

export const dark: PaletteOptions = {
  mode: "dark",

  primary: {
    main: "rgb(45,136,255)",
  },

  background: {
    default: "rgb(24,25,26)",
  },

  example: {
    primary: "#49b4ff",
    secondary: "#ef3054",
  },
};

/**
 * Append custom variables to the palette object.
 * https://mui.com/material-ui/customization/theming/#custom-variables
 */
declare module "@mui/material/styles" {
  interface Palette {
    example: {
      primary: string;
      secondary: string;
    };
  }

  interface PaletteOptions {
    example: {
      primary: string;
      secondary: string;
    };
  }
}
