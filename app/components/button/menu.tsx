/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Menu as MenuIcon } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { useToggleNavigationDrawer } from "../../layout/drawer-navigation";

export function MenuButton(props: IconButtonProps) {
  const toggle = useToggleNavigationDrawer();

  return (
    <IconButton onClick={toggle} {...props}>
      <MenuIcon />
    </IconButton>
  );
}
