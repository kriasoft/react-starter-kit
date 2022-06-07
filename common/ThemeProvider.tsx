/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { detectTheme, saveTheme, ToggleThemeContext } from "../core";
import * as theme from "../theme";

function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const [value, setValue] = React.useState(detectTheme);

  const toggleTheme = React.useCallback(() => {
    setValue(({ palette }) => {
      if (palette.mode === theme.light.palette.mode) {
        saveTheme(theme.dark.palette.mode);
        return theme.dark;
      } else {
        saveTheme(theme.light.palette.mode);
        return theme.light;
      }
    });
  }, []);

  return (
    <MuiThemeProvider theme={value}>
      <ToggleThemeContext.Provider value={toggleTheme}>
        {props.children}
      </ToggleThemeContext.Provider>
    </MuiThemeProvider>
  );
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

export { ThemeProvider, ToggleThemeContext };
