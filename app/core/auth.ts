/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type User, type UserCredential } from "firebase/auth";
import * as React from "react";
import { atom, useRecoilValueLoadable } from "recoil";
import { useOpenLoginDialog } from "../dialogs/LoginDialog.js";
import {
  auth,
  signIn,
  type SignInMethod,
  type SignInOptions,
} from "./firebase.js";

export const SignInMethods: SignInMethod[] = [
  "google.com",
  "apple.com",
  "anonymous",
];

export const CurrentUser = atom<User | null>({
  key: "CurrentUser",
  dangerouslyAllowMutability: true,
  effects: [
    (ctx) => {
      if (ctx.trigger === "get") {
        return auth.onAuthStateChanged((user) => {
          ctx.setSelf(user);
        });
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
  const value = useRecoilValueLoadable(CurrentUser);
  return value.state === "loading" ? undefined : value.valueOrThrow();
}

export function useSignIn() {
  const openLoginDialog = useOpenLoginDialog();
  return React.useCallback(
    async function (options?: SignInOptions) {
      if (options?.method) {
        try {
          return await signIn(options);
        } catch (err) {
          return await openLoginDialog({ error: err as Error });
        }
      } else {
        return await openLoginDialog();
      }
    },
    [openLoginDialog],
  );
}

export function useSignOut() {
  return React.useCallback(() => auth.signOut(), []);
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
  deps: React.DependencyList = [],
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
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [openLoginDialog, ...deps],
  );
}

type AuthCallbackParameters<T extends AuthCallback> = Parameters<T> extends [
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  infer _,
  ...infer Tail,
]
  ? Tail
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthCallback = (user: User, ...args: any) => any;

export {
  type SignInMethod,
  type SignInOptions,
  type User,
  type UserCredential,
};
