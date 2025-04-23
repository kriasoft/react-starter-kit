/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigationDrawerOpen } from "./drawer-navigation";

const Root = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 500,
  lineHeight: "1em",
  display: "inline-block",
  whiteSpace: "nowrap",
  opacity: 0,
  ["&.Mui-expanded"]: {
    opacity: 1,
  },
  transition: theme.transitions.create("opacity", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  }),
}));

export function Logo(props: LogoProps) {
  const expanded = useNavigationDrawerOpen();
  const cls = expanded ? "Mui-expanded" : undefined;

  return <Root className={cls} variant="h1" children="Acme Inc." {...props} />;
}

interface LogoProps extends TypographyProps {}
