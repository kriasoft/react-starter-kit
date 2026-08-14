import * as React from "react";
import "vite/client";

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
}

declare module "*.css";

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
