/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { CssBaseline, PaletteMode, Toolbar } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { Action, Update } from "history";
import * as React from "react";
import { Environment, RelayEnvironmentProvider } from "react-relay";
import { History, HistoryContext, LocationContext } from "../core/history";
import type { RouteResponse } from "../core/router";
import { resolveRoute } from "../core/router";
import { LoginDialog } from "../dialogs";
import theme from "../theme";
import { AppToolbar } from "./AppToolbar";
import { ErrorPage } from "./ErrorPage";

type AppProps = {
  history: History;
  relay: Environment;
};

export class App extends React.Component<AppProps> {
  state = {
    route: undefined as RouteResponse | undefined,
    location: this.props.history.location,
    error: undefined as Error | undefined,
    theme: (window?.localStorage?.getItem("theme") === "dark"
      ? "dark"
      : "light") as PaletteMode,
  };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  dispose?: () => void;

  componentDidMount(): void {
    const { history } = this.props;
    this.dispose = history.listen(this.renderPath);
    this.renderPath({ location: history.location, action: Action.Pop });
  }

  componentDidUpdate(): void {
    if (this.state.route?.title) {
      self.document.title = this.state.route.title;
    }
  }

  componentWillUnmount(): void {
    if (this.dispose) this.dispose();
  }

  componentDidCatch(error: Error, errorInfo: unknown): void {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  renderPath = async (ctx: Update): Promise<void> => {
    resolveRoute({
      path: ctx.location.pathname,
      relay: this.props.relay,
    }).then((route) => {
      if (route.error) console.error(route.error);
      this.setState({ route, location: ctx.location, error: route.error });
    });
  };

  handleChangeTheme = (): void => {
    this.setState((x: { theme: PaletteMode }) => {
      const theme = x.theme === "light" ? "dark" : "light";
      window.localStorage?.setItem("theme", theme);
      return { ...x, theme };
    });
  };

  render(): JSX.Element {
    const { history } = this.props;
    const { route, location, error } = this.state;

    if (error) {
      return (
        <ThemeProvider theme={theme[this.state.theme]}>
          <ErrorPage error={error} history={history} />;
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme[this.state.theme]}>
        <RelayEnvironmentProvider environment={this.props.relay}>
          <HistoryContext.Provider value={history}>
            <LocationContext.Provider value={location}>
              <CssBaseline />
              <AppToolbar onChangeTheme={this.handleChangeTheme} />
              <Toolbar />
              {route?.component
                ? React.createElement(route.component, route.props)
                : null}
              <LoginDialog />
            </LocationContext.Provider>
          </HistoryContext.Provider>
        </RelayEnvironmentProvider>
      </ThemeProvider>
    );
  }
}
