/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { config as appConfig } from ".";

type Config = {
  baseUrl?: string;
  request?: Request;
  records?: ConstructorParameters<typeof RecordSource>[0];
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export function createRelay(config: Config = {}): Environment {
  const recordSource = new RecordSource(config.records);
  const store = new Store(recordSource);
  const baseUrl = config.baseUrl || "";

  const network = Network.create((operation, variables): Promise<any> => {
    const cookie = config.request?.headers.get("cookie");
    return fetch(`${baseUrl}${appConfig.api.path}`, {
      method: "POST",
      headers: {
        ...(cookie && { cookie }),
        "content-Type": "application/json",
      },
      body: JSON.stringify({ query: operation.text, variables }),
      ...(!config.request && { credentials: "include" }),
    }).then((res) => res.json());
  });

  return new Environment({
    store,
    network,
    handlerProvider: null,
  });
}
