/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createStore, Provider } from "jotai";
import { createElement, ReactNode } from "react";

/**
 * Global state management powered by Jotai.
 * @see https://jotai.org/
 */
export const store = createStore();

export function StoreProvider(props: StoreProviderProps): JSX.Element {
  return createElement(Provider, { store, ...props });
}

export type StoreProviderProps = {
  children: ReactNode;
};
