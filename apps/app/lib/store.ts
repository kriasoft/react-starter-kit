import { createStore, Provider } from "jotai";
import type { ReactNode } from "react";
import { createElement } from "react";

/**
 * Global state management powered by Jotai.
 * @see https://jotai.org/
 */
export const store = createStore();

export function StoreProvider(props: StoreProviderProps) {
  return createElement(Provider, { store, ...props });
}

export type StoreProviderProps = {
  children: ReactNode;
};
