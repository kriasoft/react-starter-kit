/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

declare type Bindings = {
  APP_ENV: "local" | "test" | "prod";
  APP_NAME: string;
  APP_HOSTNAME: string;
  GOOGLE_CLOUD_CREDENTIALS: string;
};

declare type Env = {
  Bindings: Bindings;
};

declare const bindings: Bindings;

declare function getMiniflareBindings<T = Bindings>(): T;
