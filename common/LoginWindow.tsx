/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { LoginMethod, type User } from "../core";

// Pop-up window for Apple/Google/Facebook authentication
let loginWindow = null as WindowProxy | null;

function LoginWindow(props: LoginWindowProps): JSX.Element {
  const { open, method, onSuccess, onError } = props;

  React.useEffect(() => {
    if (open && method) {
      function handleMessage(event: MessageEvent) {
        if (
          event.origin === window.location.origin &&
          event.source === loginWindow
        ) {
          if (event.data.error) {
            onError?.(event.data.error);
          } else {
            onSuccess?.(event.data.user);
          }
        }
      }

      const url = `/auth/${method?.toLowerCase()}`;

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

      window.addEventListener("message", handleMessage);

      return () => {
        window.removeEventListener("message", handleMessage);
        loginWindow?.close();
        loginWindow = null;
      };
    }
  }, [open, method, onSuccess, onError]);

  return null as unknown as JSX.Element;
}

type LoginWindowProps = {
  open: boolean;
  method?: LoginMethod;
  onSuccess?: (user: User | null) => void;
  onError?: (err: Error | string) => void;
};

export { LoginWindow };
