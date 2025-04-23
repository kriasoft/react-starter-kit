/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { DarkMode, LightMode } from "@mui/icons-material";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  menuClasses,
  MenuItem,
  MenuProps,
} from "@mui/material";
import {
  styled,
  SupportedColorScheme,
  useColorScheme,
} from "@mui/material/styles";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { CSSProperties, MouseEventHandler, useCallback } from "react";

const anchorElAtom = atom<HTMLElement>();

const Root = styled(Menu)({
  [`& .${menuClasses.paper}`]: {
    width: "100%",
    maxWidth: 180,
  } as CSSProperties,
});

const menuItems = [
  {
    label: "Light theme",
    value: "light",
    icon: () => <LightMode />,
  },
  {
    label: "Dark theme",
    value: "dark",
    icon: () => <DarkMode />,
  },
  {
    label: "Device default",
    value: "system",
    icon: (mode?: SupportedColorScheme) =>
      mode === "light" ? <LightMode /> : <DarkMode />,
  },
];

export function ThemeSwitcherMenu(props: ThemeSwitcherMenuProps) {
  const anchorEl = useAtomValue(anchorElAtom);
  const handleClose = useHandleClose();
  const { mode, systemMode } = useColorScheme();
  const setMode = useSetMode();

  return (
    <Root
      id="theme-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      role="menu"
      {...props}
    >
      {menuItems.map((item) => (
        <MenuItem
          key={item.value}
          selected={mode === item.value}
          tabIndex={0}
          role="menuitem"
          aria-label={`Switch to ${item.value} theme mode`}
          aria-disabled={false}
          onClick={setMode}
          data-mode={item.value}
          defaultValue={item.value}
          dense
        >
          <ListItemIcon aria-hidden={true}>
            {item.icon(systemMode)}
          </ListItemIcon>
          <ListItemText>{item.label}</ListItemText>
        </MenuItem>
      ))}
    </Root>
  );
}

function useHandleClose() {
  const setAnchor = useSetAtom(anchorElAtom);
  return useCallback<CloseHandler>(() => setAnchor(undefined), [setAnchor]);
}

export function useToggleThemeMenu() {
  const setAnchor = useSetAtom(anchorElAtom);
  return useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      const anchorEl = event.currentTarget;
      setAnchor((prev) => (prev ? undefined : anchorEl));
    },
    [setAnchor],
  );
}

function useSetMode() {
  const setAnchor = useSetAtom(anchorElAtom);
  const { setMode } = useColorScheme();

  return useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      const mode = event.currentTarget.dataset.mode as ThemeMode;
      setMode(mode);
      setAnchor(undefined);
    },
    [setAnchor, setMode],
  );
}

type ThemeMode = SupportedColorScheme | "system";
type CloseHandler = NonNullable<MenuProps["onClose"]>;
type ThemeSwitcherMenuProps = Omit<MenuProps, "anchorEl" | "open" | "onClose">;

export { DarkMode, LightMode };
