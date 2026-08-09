import * as React from "react";
import "vite/client";

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_ORIGIN: string;
}

declare module "*.css";

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
