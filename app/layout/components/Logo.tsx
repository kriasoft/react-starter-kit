/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Typography, TypographyProps } from "@mui/material";

export function Logo(props: TypographyProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Typography
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        fontSize: "1.5rem",
        fontWeight: 500,
      }}
      variant="h1"
      {...other}
    >
      {import.meta.env.VITE_APP_NAME}
    </Typography>
  );
}
