/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/material";
import * as React from "react";

/**
 * An error screen that will be used as a fallback UI.
 * @see https://reactjs.org/docs/error-boundaries
 */
export class ErrorBoundary extends React.Component<Props> {
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  override state: State = { error: undefined };

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  override render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <Container sx={{ marginTop: "43vh" }}>
        <Container maxWidth="sm">
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontSize: "2em",
              fontWeight: 300,
              "& strong": {
                fontWeight: 400,
              },
            }}
          >
            <strong>Error {error.status || 500}</strong>: {error.message}
          </Typography>
        </Container>
      </Container>
    );
  }
}

type Props = {
  children: React.ReactNode;
};

type State = {
  error: (Error & { status?: number }) | undefined;
};
