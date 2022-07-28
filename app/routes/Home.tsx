/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Box, Container, Typography } from "@mui/material";
import { ButtonOne, ButtonTwo } from "core";

export default function Home(): JSX.Element {
  return (
    <Container sx={{ py: "20vh" }} maxWidth="sm">
      <Typography sx={{ mb: 2 }} variant="h1" align="center">
        Welcome to React Starter Kit!
      </Typography>

      <Typography sx={{ mb: 4 }} variant="h3" align="center">
        The web's most popular Jamstack React template.
      </Typography>

      <Box sx={{ display: "flex", gridGap: "1rem", justifyContent: "center" }}>
        <ButtonOne />
        <ButtonTwo />
      </Box>
    </Container>
  );
}
