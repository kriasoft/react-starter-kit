/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Close } from "@mui/icons-material";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  Typography,
} from "@mui/material";
import * as React from "react";
import { LoginButton, type LoginCallback } from "../common/LoginButton.js";
import { type UserCredential } from "../core/auth.js";

export function LoginDialog(props: LoginDialogProps): JSX.Element {
  const { onClose, ...other } = props;
  const [handleLogin, error] = useHandleLogin(onClose);
  const handleClose = useHandleClose(onClose);

  return (
    <Dialog
      scroll="body"
      maxWidth="xs"
      fullWidth
      onClose={handleClose}
      {...other}
    >
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
          onClick={handleClose}
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

        <LoginButton sx={{ mb: 2 }} method="google" onClick={handleLogin} />
        <LoginButton sx={{ mb: 0 }} method="facebook" onClick={handleLogin} />
      </DialogContent>
    </Dialog>
  );
}

function useHandleLogin(onClose?: CloseCallback) {
  const [error, setError] = React.useState<string>();

  const handleLogin = React.useCallback<LoginCallback>(
    (event, result) => {
      setError(undefined);
      result
        .then(onClose)
        .catch((err) => setError(err?.message ?? "Login failed."));
    },
    [onClose]
  );

  return [handleLogin, error] as const;
}

function useHandleClose(onClose?: CloseCallback) {
  return React.useCallback(() => {
    onClose?.(null);
  }, [onClose]);
}

// #region TypeScript declarations

export type CloseCallback = (user: UserCredential | null) => void;
export type LoginDialogProps = Omit<DialogProps, "children" | "onClose"> & {
  onClose?: CloseCallback;
};

// #endregion
