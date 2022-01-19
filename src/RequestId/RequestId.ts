import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from "express";
import { RequestIdOptions } from './RequestIdOptions';


const asyncLocalStorage = new AsyncLocalStorage<string>();
export const requestIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const options = req.inject(RequestIdOptions);
    const requestId: string = req.headers[options.headerName]?.toString?.() || options.generator();
    await asyncLocalStorage.run(requestId, async () => {
        if (options.setHeader) {
            res.set(options.headerName, requestId);
        }
        return next();
    });
}

export const requestId = () => asyncLocalStorage.getStore();
