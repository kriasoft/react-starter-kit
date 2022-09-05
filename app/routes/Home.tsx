/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Api, GitHub } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { usePageEffect } from "../core/page.js";

export default function Home(): JSX.Element {
  usePageEffect({ title: "React App" });

  return (
    <Container sx={{ py: "20vh" }} maxWidth="sm">
      <Typography sx={{ mb: 2 }} variant="h1" align="center">
        Welcome to React Starter Kit!
      </Typography>

      <Typography sx={{ mb: 4 }} variant="h3" align="center">
        The web&apos;s most popular Jamstack React template.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gridGap: "1rem",
        }}
      >
        <Button
          variant="outlined"
          size="large"
          href={`/api`}
          children="Explorer API"
          startIcon={<Api />}
        />
        <Button
          variant="outlined"
          size="large"
          href="https://github.com/kriasoft/react-starter-kit"
          children="View on GitHub"
          startIcon={<GitHub />}
        />
      </Box>
    </Container>
  );
}
