import { Middleware } from './Middleware';

export interface IWebApplication {
  UseMiddleware<T extends Middleware>(
    middleware: new (...args: any) => T
  ): void;
}
