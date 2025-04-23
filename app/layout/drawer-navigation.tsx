/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Menu } from "@mui/icons-material";
import {
  Box,
  Drawer,
  drawerClasses,
  DrawerProps,
  IconButton,
  IconButtonProps,
  List,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CSSProperties, useCallback } from "react";
import { Logo } from "./logo";
import { NavigationItem } from "./navigation";

export const minimizedWidth = 72;
export const maximizedWidth = 320;

export const openAtom = atomWithStorage<boolean | null>(
  "drawer:nav:open",
  null,
);

const Root = styled(Drawer)(({ theme }) => ({
  width: "100%",
  maxWidth: "var(--width)",
  transition: theme.transitions.create("max-width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [`& .${drawerClasses.paper}`]: {
    width: "100%",
    maxWidth: "var(--width)",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gridTemplateColumns: "1fr",
    overflow: "hidden",
    transition: theme.transitions.create("max-width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  } as CSSProperties,
}));

const Header = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  overflow: "hidden",
}));

/**
 * NavigationDrawer component provides a responsive sidebar navigation panel.
 *
 * This component leverages Material-UI's Drawer to render an off-canvas sidebar,
 * which can be customized with navigation links or additional UI elements.
 * It's intended to serve as the primary navigation element within the application,
 * ensuring a consistent and accessible navigation experience across devices.
 */
export function NavigationDrawer(props: NavigationDrawerProps) {
  const { style, ...rest } = props;
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const open = useAtomValue(openAtom) ?? true;
  const width = useNavigationDrawerWidth();

  // Dynamic styles
  const styles = {
    root: { "--width": `${width}px`, ...style },
  } as Styles;

  return (
    <Root
      style={styles.root}
      variant={mdUp ? "permanent" : "temporary"}
      open={open}
      {...rest}
    >
      <Header>
        <MenuButton />
        <Logo />
      </Header>

      <Box>
        <List>
          <NavigationItem variant="dashboard" selected />
          <NavigationItem variant="analytics" />
          <NavigationItem variant="clients" />
          <NavigationItem variant="tasks" />
        </List>
      </Box>

      <Box>
        <Typography>Footer</Typography>
      </Box>
    </Root>
  );
}

export function MenuButton(props: IconButtonProps) {
  const toggle = useToggleNavigationDrawer();

  return (
    <IconButton onClick={toggle} {...props}>
      <Menu />
    </IconButton>
  );
}

export function useNavigationDrawerWidth() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const open = useAtomValue(openAtom) ?? true;
  return mdUp ? (open ? maximizedWidth : minimizedWidth) : 0;
}

export function useToggleNavigationDrawer() {
  const setOpen = useSetAtom(openAtom);
  return useCallback(() => {
    setOpen((prev) => (prev === null ? true : !prev));
  }, [setOpen]);
}

export function useNavigationDrawerOpen() {
  return useAtomValue(openAtom) ?? true;
}

type NavigationDrawerProps = Omit<DrawerProps, "open">;
type Styles = { root: CSSProperties };
