/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Box } from "@mui/material";
import { useOutlet } from "react-router-dom";

export default function SettingsLayout(): JSX.Element {
  const outlet = useOutlet();

  return <Box>{outlet}</Box>;
}
