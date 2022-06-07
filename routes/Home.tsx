/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Api, GitHub } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import * as React from "react";
import { useLoginDialog, useNavigate } from "../hooks";

function Home(): JSX.Element {
  const loginDialog = useLoginDialog();
  const navigate = useNavigate();

  function signIn(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    loginDialog.show();
  }

  return (
    <Box>
      <Container sx={{ py: "20vh" }} maxWidth="sm">
        <Typography sx={{ mb: 2 }} variant="h1" align="center">
          Welcome to React Starter Kit!
        </Typography>

        <Typography sx={{ mb: 4 }} variant="h3" align="center">
          The web's most popular Jamstack React template.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            ".MuiButton-root": { m: 1 },
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
    </Box>
  );
}

export default Home;
export type Home = typeof Home;
