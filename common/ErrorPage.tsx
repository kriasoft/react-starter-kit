/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Container, CssBaseline, Typography } from "@material-ui/core";
import * as React from "react";
import type { History } from "../core/history";

export type ErrorPageProps = {
  error: Error;
  history: History;
};

export function ErrorPage(props: ErrorPageProps): JSX.Element {
  const { error } = props;

  return (
    <Container sx={{ marginTop: "43vh" }}>
      <CssBaseline />
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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <strong>Error {(error as any).status || 500}</strong>: {error.message}
        </Typography>
      </Container>
    </Container>
  );
}
