/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { ThemeOptions } from "@material-ui/core/styles";

/**
 * Style overrides for Material UI components.
 */
export const components: ThemeOptions["components"] = {
  // https://github.com/mui-org/material-ui/tree/next/packages/material-ui/src/Button
  MuiButton: {
    styleOverrides: {
      contained: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
  },
  // https://github.com/mui-org/material-ui/tree/next/packages/material-ui/src/ButtonGroup
  MuiButtonGroup: {
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },
};
