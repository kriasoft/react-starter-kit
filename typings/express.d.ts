import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Application {
    // RSK uses an internal function "handle" in start.ts.
    handle(req: Request, res: Response): Express;
  }
}
