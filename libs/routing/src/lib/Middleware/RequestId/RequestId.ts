import { HttpContext } from '@fayona/core';
import { AsyncLocalStorage } from 'async_hooks';
import type { NextFunction } from 'express';

import { RequestIdOptions } from './RequestIdOptions';

const asyncLocalStorage = new AsyncLocalStorage<string>();

export const requestId: () => string | undefined = () =>
  asyncLocalStorage.getStore();

export class RequestIdMiddleware {
  private RequestIdOptions: RequestIdOptions;
  constructor(requestIdOptions: RequestIdOptions) {
    this.RequestIdOptions = requestIdOptions;
  }
  public async Invoke(context: HttpContext, next: NextFunction): Promise<void> {
    const id: string =
      context.Request.headers[this.RequestIdOptions.HeaderName]?.toString?.() ||
      this.RequestIdOptions.Generator();
    await asyncLocalStorage.run(id, async () => {
      if (this.RequestIdOptions.SetHeader) {
        context.Response.set(this.RequestIdOptions.HeaderName, id);
      }
      next();
    });
  }
}
