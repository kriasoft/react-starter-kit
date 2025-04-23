/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { styled } from "@mui/material/styles";
import { Outlet } from "@tanstack/react-router";
import { CSSProperties, ComponentProps } from "react";
import { useNavigationDrawerWidth } from "./drawer-navigation";

export const Root = styled("main")(({ theme }) => ({
  marginLeft: "var(--navigation-drawer-width)",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export function Content(props: ContentProps) {
  const { style, ...rest } = props;
  const navigationDrawerWidth = useNavigationDrawerWidth();

  // Dynamic styles
  const styles = {
    root: {
      "--navigation-drawer-width": `${navigationDrawerWidth}px`,
      ...style,
    },
  } as Styles;

  return (
    <Root style={styles.root} {...rest}>
      <Outlet />
    </Root>
  );
}

type ContentProps = Omit<ComponentProps<typeof Root>, "children">;
type Styles = { root: CSSProperties };
