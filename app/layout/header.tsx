/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { AppBar, AppBarProps, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigationDrawerWidth } from "./drawer-navigation";

const Root = styled(AppBar)(({ theme }) => ({
  marginLeft: "var(--marin-left)",
  width: `calc(100% - var(--marin-left))`,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export function Header(props: HeaderProps) {
  const { style, ...rest } = props;
  const navDrawerWidth = useNavigationDrawerWidth();

  const styles = {
    root: { "--marin-left": `${navDrawerWidth}px`, ...style },
  } as Styles;

  return (
    <Root
      style={styles.root}
      position="static"
      color="transparent"
      elevation={0}
      {...rest}
    >
      <Toolbar>Project name</Toolbar>
    </Root>
  );
}

type Styles = { root: React.CSSProperties };
type HeaderProps = Omit<AppBarProps, "children">;
