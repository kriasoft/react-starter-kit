/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type Auth,
  type UserCredential,
} from "firebase/auth";

export const app = initializeApp({
  projectId: GOOGLE_CLOUD_PROJECT,
  appId: FIREBASE_APP_ID,
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
});

export const auth = getAuth(app);

export function signIn(options: LoginOptions): Promise<UserCredential> {
  if (options.method === "google") {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  if (options.method === "facebook") {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
  }

  throw new Error(`Not supported: ${options.method}`);
}

// #region TypeScript declarations

export type LoginMethod = "apple" | "google" | "facebook" | "anonymous";

export type LoginOptions = {
  method: LoginMethod;
};

export type Firebase = {
  app: FirebaseApp;
  auth: Auth;
  signIn: typeof signIn;
};

// #endregion
