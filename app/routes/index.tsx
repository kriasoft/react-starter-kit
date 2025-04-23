/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to React Starter Kit
      </Typography>
    </Container>
  );
}
