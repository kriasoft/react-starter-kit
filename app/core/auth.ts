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

/**
 * Returns a memoized version of the callback that triggers opening a login
 * dialog in case the user is not authenticated.
 *
 * @example
 *    const saveProfile = useAuthCallback(async (me) => {
 *      await updateProfile(me, input);
 *    }, [input])
 */
export function useAuthCallback<T extends AuthCallback>(
  callback: T,
  deps?: React.DependencyList
): (...args: AuthCallbackParameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const openLoginDialog = useOpenLoginDialog();
  return React.useCallback(
    async (...args: AuthCallbackParameters<T>) => {
      const fb = await import("../core/firebase.js");

      try {
        if (!fb.auth.currentUser) {
          await openLoginDialog();
        }

        if (!fb.auth.currentUser) {
          return Promise.reject(new Error("Not authenticated."));
        }

        return await callback(fb.auth.currentUser, ...args);
      } catch (err) {
        const code = (err as { code?: string })?.code;

        // https://firebase.google.com/docs/reference/js/auth
        if (code?.startsWith?.("/auth") || code === "permission-denied") {
          await openLoginDialog();

          if (!fb.auth.currentUser) {
            throw new Error("Not authenticated.");
          }

          return await callback(fb.auth.currentUser, ...args);
        } else {
          throw err;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openLoginDialog, ...(deps ?? [])]
  );
}

type AuthCallbackParameters<T extends AuthCallback> = Parameters<T> extends [
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  infer _,
  ...infer Tail
]
  ? Tail
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthCallback = (user: User, ...args: any) => any;

export { type SignInMethod, type LoginOptions, type User, type UserCredential };
