/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/material";
import ImageGallery from "../../layout/components/ImageGallery/index.js";

export function Component(): JSX.Element {
  return (
    <Container sx={{ py: "20vh" }} maxWidth="xl">
      <Typography sx={{ mb: 2 }} variant="h1" align="center">
        Image Gallery
      </Typography>

      <ImageGallery />
    </Container>
  );
}

Component.displayName = "Dashboard";
