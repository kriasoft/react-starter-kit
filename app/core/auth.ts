/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type User, type UserCredential } from "firebase/auth";
import * as React from "react";
import { atom, useRecoilValue } from "recoil";
import { useOpenLoginDialog } from "../dialogs/LoginDialog.js";
import { type LoginOptions, type SignInMethod } from "./firebase.js";

export const CurrentUser = atom<User | null>({
  key: "CurrentUser",
  dangerouslyAllowMutability: true,
  default: undefined,
  effects: [
    (ctx) => {
      if (ctx.trigger === "get") {
        const promise = import("./firebase.js").then((fb) =>
          fb.auth.onAuthStateChanged((user) => {
            ctx.setSelf(user);
          })
        );

        return () => promise.then((unsubscribe) => unsubscribe());
      }
    },
  ],
});

/**
 * The currently logged-in (authenticated) user object.
 *
 * @example
 *   const { useCurrentUser } from "../core/auth.js";
 *
 *   function Example(): JSX.Element {
 *     const me = useCurrentUser();
 *     // => { uid: "xxx", email: "me@example.com", ... }
 *     // => Or, `null` when not authenticated
 *     // => Or, `undefined` when not initialized
 *   }
 */
export function useCurrentUser() {
  return useRecoilValue(CurrentUser);
}

/**
 * Authentication manager.
 *
 * @example
 *   import { useAuth } from "../core/auth.js";
 *
 *   function Example(): JSX.Element {
 *     const auth = useAuth();
 *
 *     return (
 *       <Box>
 *         <Button onClick={auth.signIn}>Sign In</Button>
 *         <Button onClick={auth.signOut}>Sign Out</Button>
 *       </Box>
 *     );
 *   }
 */
export function useAuth() {
  const openLoginDialog = useOpenLoginDialog();
  return React.useMemo(
    () => ({
      async signIn(options?: LoginOptions) {
        const fb = await import("./firebase.js");
        if (options) {
          return fb.signIn(options);
        } else {
          return openLoginDialog();
        }
      },
      async signOut() {
        const fb = await import("./firebase.js");
        await fb.auth.signOut();
      },
    }),
    [openLoginDialog]
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAuthCallback<T extends (...args: any) => Promise<any>>(
  callback: T,
  deps?: React.DependencyList
) {
  const auth = useAuth();
  return React.useCallback<(...args: Parameters<T>) => Promise<void>>(
    async (...args) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await callback(...(args as any));
      } catch (err) {
        const code = (err as { code?: string })?.code;
        if (
          code &&
          [
            "permission-denied",
            "auth/requires-recent-login",
            "auth/user-token-expired",
            "auth/null-user",
          ].includes(code)
        ) {
          const user = await auth.signIn();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (user) await callback(...(args as any));
        } else {
          throw err;
        }
      }
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [auth, callback, ...(deps ?? [])]
  );
}

export { type SignInMethod, type LoginOptions, type User, type UserCredential };
