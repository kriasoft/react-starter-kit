/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  Typography,
} from "@mui/material";
import { type UserCredential } from "firebase/auth";
import * as React from "react";
import { atom, useRecoilCallback, useRecoilValue } from "recoil";
import { LoginButton } from "../common/LoginButton.js";

export const LoginDialogState = atom<LoginDialogAtom>({
  key: "LoginDialogState",
  default: { open: false },
});

export function LoginDialog(props: LoginDialogProps): JSX.Element {
  const { error, handleLogin, ...state } = useRecoilValue(LoginDialogState);

  return (
    <Dialog scroll="body" maxWidth="xs" fullWidth {...props} {...state}>
      <DialogContent
        sx={{
          py: 4,
          px: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={(event) => state.onClose?.(event, "backdropClick")}
          children={<Close />}
        />

        <Typography
          sx={{ mb: 3 }}
          variant="h3"
          align="center"
          children="Log in / Register"
        />

        {error && (
          <Alert
            sx={{ marginBottom: "1rem", width: "100%" }}
            severity="error"
            children={error}
          />
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gridGap: "1rem",
            width: "100%",
          }}
        >
          <LoginButton method="google.com" onLogin={handleLogin} fullWidth />
          <LoginButton method="facebook.com" onLogin={handleLogin} fullWidth />
          <LoginButton method="anonymous" onLogin={handleLogin} fullWidth />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export function useOpenLoginDialog() {
  return useRecoilCallback(
    (ctx) => (params?: LoginDialogProps) => {
      return new Promise<UserCredential | undefined>((resolve) => {
        ctx.set(LoginDialogState, {
          ...params,
          open: true,
          error: undefined,
          onClose(event: React.MouseEvent, reason) {
            params?.onClose?.(event, reason);
            if (!event.isDefaultPrevented()) {
              ctx.set(LoginDialogState, (prev) => ({ ...prev, open: false }));
              resolve(undefined);
            }
          },
          handleLogin(err: Error | null, user: UserCredential | undefined) {
            if (err) {
              const error = err.message;
              ctx.set(LoginDialogState, (prev) => ({ ...prev, error }));
            } else {
              ctx.set(LoginDialogState, (prev) => ({ ...prev, open: false }));
              resolve(user);
            }
          },
        });
      });
    },
    []
  );
}

// #region TypeScript declarations

export type LoginDialogProps = Omit<DialogProps, "open" | "children">;
export type LoginDialogAtom = LoginDialogProps & {
  open: boolean;
  error?: string;
  handleLogin?: (err: Error | null, user: UserCredential | undefined) => void;
};

// #endregion
