import { AsyncLocalStorage } from 'async_hooks';
import type { NextFunction, Request, Response } from 'express';
import { RequestIdOptions } from './RequestIdOptions';

const asyncLocalStorage = new AsyncLocalStorage<string>();
export const requestIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const options = req.inject(RequestIdOptions);
  const requestId: string =
    req.headers[options.HeaderName]?.toString?.() || options.Generator();
  await asyncLocalStorage.run(requestId, async () => {
    if (options.SetHeader) {
      res.set(options.HeaderName, requestId);
    }
    return next();
  });
};

export const requestId: () => string | undefined = () =>
  asyncLocalStorage.getStore();
