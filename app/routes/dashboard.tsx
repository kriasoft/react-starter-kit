/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Box, Card, CardContent, Container, Typography } from "@mui/joy";
import { usePageEffect } from "../core/page";

export const Component = function Dashboard(): JSX.Element {
  usePageEffect({ title: "Dashboard" });

  return (
    <Container sx={{ py: 2 }}>
      <Typography sx={{ mb: 2 }} level="h2">
        Dashboard
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { sm: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Card sx={{ gridArea: "1 / 1 / 2 / -1" }}>
          <CardContent sx={{ minHeight: 300 }}>
            <Typography level="h3">Card title</Typography>
            <Typography>Card content</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ minHeight: 150 }}>
            <Typography level="h3">Card title</Typography>
            <Typography>Card content</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ minHeight: 150 }}>
            <Typography level="h3">Card title</Typography>
            <Typography>Card content</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
