/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createTheme } from "@mui/material/styles";

/**
 * Customized Material UI theme.
 * @see https://mui.com/material-ui/customization/theming/
 */
export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "[data-mode-%s]",
  },
  colorSchemes: {
    dark: true,
  },
});
