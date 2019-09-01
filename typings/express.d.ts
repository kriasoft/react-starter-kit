import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  import { Express } from 'express';

  interface Application {
    // RSK uses an internal function "handle" in start.ts.
    handle(req: Request, res: Response): Express;
  }
}

declare global {
  namespace Express {
    // For use of passport
    interface User {
      id: string;
    }
  }
}
