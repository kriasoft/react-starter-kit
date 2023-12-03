/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/joy";
import { usePageEffect } from "../core/page";

export const Component = function Messages(): JSX.Element {
  usePageEffect({ title: "Messages" });

  return (
    <Container sx={{ py: 2 }}>
      <Typography level="h2" gutterBottom>
        Messages
      </Typography>
      <Typography>Coming soon...</Typography>
    </Container>
  );
};
