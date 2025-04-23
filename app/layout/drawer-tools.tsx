/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Drawer,
  drawerClasses,
  DrawerProps,
  iconButtonClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { atomWithStorage } from "jotai/utils";
import { CSSProperties } from "react";
import { UserPictureButton } from "../components/button/user";
import { ThemeSwitcherMenu } from "./theme";
import { ActionButton } from "./tools";

export const minimizedWidth = 64;
export const maximizedWidth = 320;

export const openAtom = atomWithStorage<boolean | null>(
  "drawer:nav:open",
  null,
);

const Root = styled(Drawer)({
  width: "var(--width)",
  [`& .${drawerClasses.paper}`]: {
    width: "var(--width)",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
  },
});

const MenuBar = styled("div")({
  width: "var(--width)",
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr auto",
});

const MenuBarItem = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  paddingTop: 8,
  paddingBottom: 8,
  gap: 8,
  [`& .${iconButtonClasses.sizeLarge}`]: {
    marginBottom: 8,
  },
  [`& .${iconButtonClasses.root}:not(.${iconButtonClasses.sizeLarge})`]: [
    theme.applyStyles("light", {
      opacity: 0.7,
    }),
    theme.applyStyles("dark", {
      opacity: 0.5,
    }),
  ],
  [`& .${iconButtonClasses.root}:not(.${iconButtonClasses.sizeLarge}):hover`]: [
    theme.applyStyles("light", {
      opacity: 1,
    }),
    theme.applyStyles("dark", {
      opacity: 0.8,
    }),
  ],
}));

export function ToolsDrawer(props: ToolsDrawerProps) {
  const { style, ...rest } = props;

  // Dynamic styles
  const styles = {
    root: { "--width": `${minimizedWidth}px`, ...style },
    menuBar: { "--width": `${minimizedWidth}px` },
  } as Styles;

  return (
    <Root style={styles.root} variant="permanent" anchor="right" open {...rest}>
      <MenuBar style={styles.menuBar}>
        <MenuBarItem sx={{ py: 2, px: 1.5 }}>
          <UserPictureButton />
          <ActionButton variant="notifications" />
          <ActionButton variant="assistant" />
          <ActionButton variant="help" />
        </MenuBarItem>

        <MenuBarItem>
          <ActionButton variant="theme" />
          <ThemeSwitcherMenu />
        </MenuBarItem>
      </MenuBar>
    </Root>
  );
}

type ToolsDrawerProps = Omit<DrawerProps, "open">;
type Styles = { root: CSSProperties; menuBar: CSSProperties };
