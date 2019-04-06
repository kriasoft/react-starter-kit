// Declare globals
declare const __DEV__: boolean;

// Extend globals
interface Window {
  ga: any;
  App: any;
}
interface NodeModule {
  hot: any;
}

// Extend existing modules
declare module 'child_process' {
  interface ChildProcess {
    host?: string;
  }
}

// Declare modules for non-typed packages
declare module "isomorphic-style-loader/StyleContext"
declare module "react-deep-force-update"
declare module "apollo-link-logger"
declare module "webpack-hot-middleware/client";
declare module "react-dev-utils/launchEditorEndpoint";
declare module "react-dev-utils/errorOverlayMiddleware"
declare module "react-error-overlay";
declare module "react-test-renderer"
declare module "isomorphic-style-loader/withStyles" {
  const _default: <T>(s1: string, s2?: string, s3?: string, s4?: string, s5?: string) => (arg0: typeof T) => typeof T;
  export default _default;
}

// Declare non-ts modules to be loaded by webpack loaders
declare module "*.css"
declare module "*.md"
declare module "*.png"
declare module "*.graphql" {
  import {DocumentNode} from "graphql";
  var d: DocumentNode;
  export default d;
}
