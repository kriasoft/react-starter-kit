import {Context} from "universal-router";

declare module 'universal-router' {
  interface Route<C extends Context = any, R = any> {
    load?: () => Promise<any>
  }
}
