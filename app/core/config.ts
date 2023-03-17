/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

export type EnvName = "prod" | "test" | "local";
export type Config = {
  app: {
    env: EnvName;
    name: string;
    origin: string;
    hostname: string;
  };
  firebase: {
    projectId: string;
    appId: string;
    apiKey: string;
    authDomain: string;
    measurementId: string;
  };
};

export const configs = JSON.parse(import.meta.env.VITE_CONFIG);
export const config: Config =
  location.hostname === configs.prod.app.hostname
    ? configs.prod
    : location.hostname === configs.test.app.hostname
    ? configs.test
    : configs.local;
