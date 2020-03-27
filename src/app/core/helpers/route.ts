import { HttpResponse } from './response';
import { Request, Response, NextFunction } from 'express';
import { AppUtils } from '@core/utils';

export function wrapRoutes(...middlewares) {
    return middlewares.map((middleware) => async (req: Request, res: Response, next: NextFunction, ...args) => {
        try {
            const response = await middleware(req, res, next) as HttpResponse;
            if (AppUtils.notNullOrUndefined(response)) {
                if (response instanceof HttpResponse) {
                    return res.status(response.code).json(response);
                } else {
                    return res.status(200).json(response);
                }
            }
        } catch (error) {
            // console.log(req.baseUrl, error);
            // return res.status(error.code).json(error);
            // next(error);
        }
    });
}
