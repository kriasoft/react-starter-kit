/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";
import {
  Dropdown,
  IconButton,
  IconButtonProps,
  ListItemContent,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  useColorScheme,
} from "@mui/joy";
import { memo } from "react";

export function ColorSchemeButton(props: ColorSchemeButtonProps): JSX.Element {
  const { mode, systemMode } = useColorScheme();

  return (
    <Dropdown>
      <MenuButton slots={{ root: IconButton }} slotProps={{ root: props }}>
        {mode === "light" || (mode === "system" && systemMode === "light") ? (
          <DarkModeRounded />
        ) : (
          <LightModeRounded />
        )}
      </MenuButton>

      <Menu size="sm">
        <ModeMenuItem mode="light" />
        <ModeMenuItem mode="dark" />
        <ModeMenuItem mode="system" />
      </Menu>
    </Dropdown>
  );
}

const ModeMenuItem = memo(function ModeMenuItem({
  mode,
}: ModeMenuItemProps): JSX.Element {
  const scheme = useColorScheme();

  return (
    <MenuItem
      onClick={() => {
        scheme.setMode(mode);
      }}
      selected={scheme.mode === mode}
    >
      <ListItemDecorator sx={{ ml: 0.5 }}>
        {mode === "light" ||
        (mode !== "dark" && scheme.systemMode === "light") ? (
          <LightModeRounded />
        ) : (
          <DarkModeRounded />
        )}
      </ListItemDecorator>
      <ListItemContent sx={{ pr: 2 }}>
        {mode === "light"
          ? "Light theme"
          : mode === "dark"
            ? "Dark theme"
            : "Device default"}
      </ListItemContent>
    </MenuItem>
  );
});

type ColorSchemeButtonProps = Omit<IconButtonProps, "children">;
type ModeMenuItemProps = { mode: "dark" | "light" | "system" };
