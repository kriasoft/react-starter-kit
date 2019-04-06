import 'child_process';

declare module 'child_process' {
  interface ChildProcess {
    host?: string;
  }
}
