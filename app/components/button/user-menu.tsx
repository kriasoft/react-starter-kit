/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Logout, Settings } from "@mui/icons-material";
import {
  ButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  menuClasses,
  MenuItem,
  MenuProps,
  styled,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

export const stateAtom = atom({
  open: false,
  anchorEl: null as HTMLElement | null,
});

const StyledMenu = styled(Menu)(() => ({
  [`& .${menuClasses.paper}`]: {
    maxWidth: 260,
    width: "100%",
  },
}));

export function UserMenu(props: UserMenuProps) {
  const { onClose, ...rest } = props;
  const state = useAtomValue(stateAtom);
  const handleClose = useHandleClose(onClose);
  const signOut = useSignOut();

  return (
    <StyledMenu
      id="user-menu"
      open={state.open}
      anchorEl={state.anchorEl}
      onClose={handleClose}
      {...rest}
    >
      <MenuItem dense>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <MenuItem onClick={signOut} dense>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </StyledMenu>
  );
}

function useHandleClose(onClose: MenuProps["onClose"]) {
  const setState = useSetAtom(stateAtom);
  return useCallback<OnClose>(
    (event, reason) => {
      onClose?.(event, reason);
      setState({ open: false, anchorEl: null });
    },
    [setState, onClose],
  );
}

function useSignOut() {
  const setState = useSetAtom(stateAtom);
  return useCallback(() => {
    const auth = getAuth();
    auth.signOut().then(() => setState({ open: false, anchorEl: null }));
  }, [setState]);
}

export function useToggleMenu(onClick?: OnClick) {
  const setState = useSetAtom(stateAtom);
  return useCallback<OnClick>(
    (event) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        setState((prev) =>
          prev.open
            ? { open: false, anchorEl: null }
            : { open: true, anchorEl: event.currentTarget },
        );
      }
    },
    [setState, onClick],
  );
}

type OnClick = NonNullable<ButtonProps["onClick"]>;
type OnClose = NonNullable<MenuProps["onClose"]>;
type UserMenuProps = Omit<MenuProps, "open" | "anchorEl">;
