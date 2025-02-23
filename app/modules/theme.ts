/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { createElement, ReactNode } from "react";

/**
 * Customized Joy UI theme.
 * @see https://mui.com/joy-ui/customization/approaches/
 */
export const theme = createTheme({
  colorSchemes: {
    dark: true,
  }
});

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  return createElement(MuiThemeProvider, { theme, ...props });
}

export type ThemeProviderProps = {
  children: ReactNode;
};
