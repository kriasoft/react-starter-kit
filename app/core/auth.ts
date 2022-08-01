/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type User, type UserCredential } from "firebase/auth";
import * as React from "react";
import { type LoginMethod, type LoginOptions } from "./firebase.js";

export const UserContext = React.createContext(
  undefined as User | null | undefined
);

export const AuthContext = React.createContext({
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  signIn(options?: LoginOptions): Promise<UserCredential> {
    return Promise.reject(new Error());
  },
  signOut(): Promise<void> {
    return Promise.resolve();
  },
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
  return React.useContext(UserContext);
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
  return React.useContext(AuthContext);
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
          ].includes(code)
        ) {
          const user = await auth.signIn({ method: "google" });
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

export { type LoginMethod, type LoginOptions, type User, type UserCredential };
