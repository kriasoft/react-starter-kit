/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function Component(): JSX.Element {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}

Component.displayName = "SettingsLayout";
