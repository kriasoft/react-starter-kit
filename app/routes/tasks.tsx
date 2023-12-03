/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/joy";
import { usePageEffect } from "../core/page";

export const Component = function Tasks(): JSX.Element {
  usePageEffect({ title: "Tasks" });

  return (
    <Container sx={{ py: 2 }}>
      <Typography level="h2" gutterBottom>
        Tasks
      </Typography>
      <Typography>Coming soon...</Typography>
    </Container>
  );
};
