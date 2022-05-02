/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { PaletteMode } from "@mui/material";
import { createTheme, Theme } from "@mui/material/styles";
import { components } from "./components";

/**
 * Customized Material UI themes for "light" and "dark" modes.
 *
 * @see https://next.material-ui.com/customization/default-theme/
 */
const themes = (["light", "dark"] as PaletteMode[]).map((mode) =>
  createTheme(
    {
      palette: {
        mode,
        primary: {
          main: mode === "light" ? "rgb(24,119,242)" : "rgb(45,136,255)",
        },
        background: {
          default: mode === "light" ? "rgb(240,242,245)" : "rgb(24,25,26)",
        },
      },

      typography: {
        fontFamily: [
          `-apple-system`,
          `"BlinkMacSystemFont"`,
          `"Segoe UI"`,
          `"Roboto"`,
          `"Oxygen"`,
          `"Ubuntu"`,
          `"Cantarell"`,
          `"Fira Sans"`,
          `"Droid Sans"`,
          `"Helvetica Neue"`,
          `sans-serif`,
        ].join(","),
      },

      components,
    },
    {
      typography: {
        h1: { fontSize: "2em" },
        h2: { fontSize: "1.5em" },
        h3: { fontSize: "1.3em" },
        h4: { fontSize: "1em" },
        h5: { fontSize: "0.8em" },
        h6: { fontSize: "0.7em" },
        button: { textTransform: "none" },
      },
    }
  )
);

export default {
  light: themes[0],
  dark: themes[1],
} as { [key in PaletteMode]: Theme };
