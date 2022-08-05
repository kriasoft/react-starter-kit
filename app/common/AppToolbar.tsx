/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { ArrowDropDown, NotificationsNone } from "@mui/icons-material";
import {
  AppBar,
  AppBarProps,
  Avatar,
  Button,
  Chip,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import { Link as NavLink } from "react-router-dom";
import { useAuth, useCurrentUser } from "../core/auth.js";
import { NotificationsMenu, UserMenu } from "../menus/index.js";
import { ThemeButton } from "./ThemeButton.js";

type AppToolbarProps = AppBarProps;

export function AppToolbar(props: AppToolbarProps): JSX.Element {
  const { sx, ...other } = props;
  const menuAnchorRef = React.createRef<HTMLButtonElement>();
  const me = useCurrentUser();
  const auth = useAuth();

  const [anchorEl, setAnchorEl] = React.useState({
    userMenu: null as HTMLElement | null,
    notifications: null as HTMLElement | null,
  });

  function openNotificationsMenu() {
    setAnchorEl((x) => ({ ...x, notifications: menuAnchorRef.current }));
  }

  function closeNotificationsMenu() {
    setAnchorEl((x) => ({ ...x, notifications: null }));
  }

  function openUserMenu() {
    setAnchorEl((x) => ({ ...x, userMenu: menuAnchorRef.current }));
  }

  function closeUserMenu() {
    setAnchorEl((x) => ({ ...x, userMenu: null }));
  }

  function signIn(event: React.MouseEvent): void {
    event.preventDefault();
    auth.signIn();
  }

  return (
    <AppBar
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, ...sx }}
      color="default"
      elevation={1}
      {...other}
    >
      <Toolbar>
        {/* App name / logo */}

        <Typography variant="h1" sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
          <Link color="inherit" underline="none" to="/" component={NavLink}>
            {APP_NAME}
          </Link>
        </Typography>

        <span style={{ flexGrow: 1 }} />

        {/* Account related controls (icon buttons) */}

        {me !== undefined && <ThemeButton sx={{ mr: 1 }} />}

        {me && (
          <Chip
            sx={{
              height: 40,
              borderRadius: 20,
              fontWeight: 600,
              backgroundColor: (x) =>
                x.palette.mode === "light"
                  ? x.palette.grey[300]
                  : x.palette.grey[700],
              ".MuiChip-avatar": { width: 32, height: 32 },
            }}
            component={NavLink}
            to="/"
            avatar={
              <Avatar
                alt={me?.displayName || (me?.isAnonymous ? "Anonymous" : "")}
                src={me?.photoURL || undefined}
              />
            }
            label={getFirstName(
              me?.displayName || (me?.isAnonymous ? "Anonymous" : "")
            )}
          />
        )}
        {me && (
          <IconButton
            sx={{
              marginLeft: (x) => x.spacing(1),
              backgroundColor: (x) =>
                x.palette.mode === "light"
                  ? x.palette.grey[300]
                  : x.palette.grey[700],
              width: 40,
              height: 40,
            }}
            children={<NotificationsNone />}
            onClick={openNotificationsMenu}
          />
        )}
        {me && (
          <IconButton
            ref={menuAnchorRef}
            sx={{
              marginLeft: (x) => x.spacing(1),
              backgroundColor: (x) =>
                x.palette.mode === "light"
                  ? x.palette.grey[300]
                  : x.palette.grey[700],
              width: 40,
              height: 40,
            }}
            children={<ArrowDropDown />}
            onClick={openUserMenu}
          />
        )}
        {me === null && (
          <Button
            variant="outlined"
            href="/login"
            color="primary"
            onClick={signIn}
            children="Log in / Register"
          />
        )}
      </Toolbar>

      {/* Pop-up menus */}

      <NotificationsMenu
        anchorEl={anchorEl.notifications}
        onClose={closeNotificationsMenu}
        PaperProps={{ sx: { marginTop: "8px" } }}
      />
      <UserMenu
        anchorEl={anchorEl.userMenu}
        onClose={closeUserMenu}
        PaperProps={{ sx: { marginTop: "8px" } }}
      />
    </AppBar>
  );
}

function getFirstName(displayName: string): string {
  return displayName && displayName.split(" ")[0];
}
