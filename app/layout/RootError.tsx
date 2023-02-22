/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

export function RootError(): JSX.Element {
  const err = useRouteError() as RouteError;

  return (
    <Container sx={{ marginTop: "43vh" }} maxWidth="sm">
      <Typography
        sx={{
          fontSize: "2em",
          fontWeight: 300,
          "& strong": { fontWeight: 400 },
        }}
        variant="h1"
        align="center"
      >
        <strong>Error {err.status || 500}</strong>:{" "}
        {err.statusText ?? err.message}
      </Typography>
    </Container>
  );
}

type RouteError = Error & { status?: number; statusText?: string };
