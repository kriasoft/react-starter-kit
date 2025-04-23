/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Analytics, Assignment, Dashboard, People } from "@mui/icons-material";
import {
  ListItemIcon,
  ListItemText,
  listItemTextClasses,
  MenuItem,
  MenuItemProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigationDrawerOpen } from "./drawer-navigation";

const variants = {
  dashboard: {
    label: "Dashboard",
    icon: <Dashboard />,
  },
  analytics: {
    label: "Analytics",
    icon: <Analytics />,
  },
  clients: {
    label: "Clients",
    icon: <People />,
  },
  tasks: {
    label: "Tasks",
    icon: <Assignment />,
  },
} as const;

const Root = styled(MenuItem)(({ theme }) => ({
  paddingLeft: 26,
  [`& .${listItemTextClasses.root}`]: {
    opacity: 0,
    transition: theme.transitions.create("opacity", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short,
    }),
  },
  [`& .${listItemTextClasses.root}.Mui-expanded`]: {
    opacity: 1,
  },
}));

export function NavigationItem(props: NavigationItemProps) {
  const { variant, ...rest } = props;
  const { label, icon } = variants[variant];
  const expanded = useNavigationDrawerOpen();
  const cls = expanded ? "Mui-expanded" : undefined;

  return (
    <Root dense {...rest}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText className={cls}>{label}</ListItemText>
    </Root>
  );
}

interface NavigationItemProps extends MenuItemProps {
  variant: keyof typeof variants;
}
