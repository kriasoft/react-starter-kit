/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { BrightnessAutoRounded } from "@mui/icons-material";
import { Box, BoxProps, IconButton, Typography } from "@mui/joy";
import { Link } from "react-router-dom";

export function Logo(props: LogoProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        py: 1,
        px: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        ...sx,
      }}
      {...other}
    >
      <IconButton component={Link} to="/" color="primary" variant="soft">
        <BrightnessAutoRounded />
      </IconButton>
      <Typography sx={{ fontSize: "1.25rem" }} level="h4" component="div">
        {import.meta.env.VITE_APP_NAME}
      </Typography>
    </Box>
  );
}

export type LogoProps = Omit<BoxProps, "children">;
