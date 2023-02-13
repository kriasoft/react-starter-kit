/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Close } from "@mui/icons-material";
import { AppBar, AppBarProps, Box, IconButton, Toolbar } from "@mui/material";
import { Link } from "../../common/Link.js";
import { Logo } from "./Logo.js";

export function BaseToolbar(props: AppBarProps): JSX.Element {
  return (
    <AppBar color="transparent" elevation={0} {...props}>
      <Toolbar>
        {/* Name / Logo */}
        <Box
          sx={{ textDecoration: "none", color: "inherit" }}
          component={Link}
          children={<Logo />}
          href="/"
        />

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} component="span" />

        {/* Close button */}
        <IconButton component={Link} href="/">
          <Close />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
