/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Web application settings where some of the values are bing replaced
 * with environment specific values. See `*.env` files.
 */
const config = {
  /**
   * Web application settings
   */
  app: {
    name: "React App",
    origin: process.env.APP_ORIGIN as string,
    env: process.env.APP_ENV as "local" | "test" | "production",
  },
  /**
   * GraphQL API and authentication endpoint(s)
   * https://github.com/kriasoft/relay-starter-kit
   */
  api: {
    origin: process.env.API_ORIGIN as string,
  },
  /**
   * Firebase and/or Firestore
   * https://firebase.google.com/docs/firestore
   */
  firebase: {
    authKey: process.env.FIREBASE_AUTH_KEY,
    authDomain: `https://${process.env.GOOGLE_CLOUD_PROJECT}.firebaseapp.com`,
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  },
  /**
   * Google Analytics (v4)
   * https://developers.google.com/analytics/devguides/collection/ga4
   */
  gtag: {
    trackingID: process.env.GA_MEASUREMENT_ID,
    anonymizeIP: true,
  },
} as const;

export default config;
export type Config = typeof config;
