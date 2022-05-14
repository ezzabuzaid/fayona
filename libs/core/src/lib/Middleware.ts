import { HttpContext } from './Http/HttpContext';

export abstract class Middleware {
  public abstract Invoke(context: HttpContext, next: any): Promise<void>;
}
