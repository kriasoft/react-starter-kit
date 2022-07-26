/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type User, type UserCredential } from "firebase/auth";
import * as React from "react";
import { type LoginMethod, type LoginOptions } from "../core/firebase.js";

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

export async function getIdToken(
  forceRefresh?: boolean
): Promise<string | null> {
  const fb = await import("../core/firebase.js");
  const idToken = await fb.auth.currentUser?.getIdToken(forceRefresh);
  return idToken ?? null;
}

export { type LoginMethod, type LoginOptions, type User, type UserCredential };
