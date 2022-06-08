/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
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
import { LoginButton } from "../common";
import { LoginMethod, type User } from "../core";

function LoginDialog(props: LoginDialogProps): JSX.Element {
  const [error, setError] = React.useState<string | undefined>();

  const handleClose = React.useCallback<React.MouseEventHandler>(
    (event) => {
      props.onClose?.(event, "backdropClick");
    },
    [props.onClose]
  );

  const handleSignIn = React.useCallback<SignInCallback>(
    (event, promise) => {
      promise
        // Close the dialog upon successful sign in
        .then((user) => user && props.onClose?.(event, "backdropClick"))
        // Otherwise, show an error message
        .catch((err) => setError(err.message));
    },
    [props.onClose]
  );

  return (
    <Dialog scroll="body" maxWidth="xs" fullWidth {...props}>
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
            sx={{ marginBottom: "1rem" }}
            severity="error"
            children={error}
          />
        )}

        <LoginButton
          sx={{ mb: 2 }}
          method={LoginMethod.Google}
          onClick={handleSignIn}
        />
        <LoginButton
          sx={{ mb: 0 }}
          method={LoginMethod.Facebook}
          onClick={handleSignIn}
        />
      </DialogContent>
    </Dialog>
  );
}

type LoginDialogProps = Omit<DialogProps, "children">;

type SignInCallback = (
  event: React.MouseEvent,
  promise: Promise<User | null | void>
) => void;

export { LoginDialog };
