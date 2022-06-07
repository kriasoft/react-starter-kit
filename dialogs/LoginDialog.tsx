/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Close, Facebook, Google } from "@mui/icons-material";
import {
  Alert,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useLoginDialog } from "../hooks";

// Pop-up window for Google/Facebook authentication
let loginWindow: WindowProxy | null = null;

export function LoginDialog(): JSX.Element {
  const [error, setError] = React.useState<string | undefined>();
  const loginDialog = useLoginDialog(true);

  // Start listening for notifications from the pop-up login window
  React.useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.source === loginWindow
      ) {
        if (event.data.error) {
          setError(event.data.error);
        } else if (event.data) {
          // TODO: Handle sign in
        }
      }
    }
    window.addEventListener("message", handleMessage, false);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <Dialog
      key={loginDialog.key}
      open={loginDialog.open}
      onClose={loginDialog.hide}
      scroll="body"
      fullScreen
    >
      <IconButton
        sx={{ position: "fixed", top: "8px", right: "8px" }}
        onClick={loginDialog.hide}
        children={<Close />}
      />

      <DialogContent
        sx={{
          maxWidth: "320px",
          margin: "0 auto",
          "& .MuiButton-root:not(:last-of-type)": {
            marginBottom: "1rem",
          },
        }}
      >
        {/* Title */}
        <Typography
          sx={{ marginTop: "25vh", marginBottom: "1rem" }}
          variant="h3"
          align="center"
          children="Log in / Register"
        />

        {/* Error message(s) */}
        {error && (
          <Alert
            sx={{ marginBottom: "1rem" }}
            severity="error"
            children={error}
          />
        )}

        {/* Login buttons */}
        <LoginButton provider="Google" />
        <LoginButton provider="Facebook" />
      </DialogContent>
    </Dialog>
  );
}

type LoginButtonProps = Omit<ButtonProps, "children"> & {
  provider: "Google" | "Facebook";
};

function LoginButton(props: LoginButtonProps): JSX.Element {
  const { provider, ...other } = props;
  const icons = { Google: <Google />, Facebook: <Facebook /> };

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    const url = (event.currentTarget as HTMLAnchorElement).href;

    if (loginWindow === null || loginWindow.closed) {
      const width = 520;
      const height = 600;
      const left =
        (window.top?.outerWidth ?? 0) / 2 +
        (window.top?.screenX ?? 0) -
        width / 2;
      const top =
        (window.top?.outerHeight ?? 0) / 2 +
        (window.top?.screenY ?? 0) -
        height / 2;
      loginWindow = window.open(
        url,
        "login",
        `menubar=no,toolbar=no,status=no,width=${width},height=${height},left=${left},top=${top}`
      );
    } else {
      loginWindow.focus();
      loginWindow.location.href = url;
    }
  }

  return (
    <Button
      variant="outlined"
      size="large"
      href={`/auth/${provider.toLowerCase()}`}
      startIcon={icons[provider]}
      onClick={handleClick}
      fullWidth
      {...other}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>
        Continue with {provider}
      </span>
    </Button>
  );
}
