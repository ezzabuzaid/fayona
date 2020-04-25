import { HttpResponse } from './response';
import { Request, Response, NextFunction } from 'express';
import { AppUtils } from '@core/utils';
import { ErrorHandling } from './errors';

export function wrapRoutes(...middlewares) {
    return middlewares.map((middleware) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(middleware(req, res, next) as HttpResponse)
            .then((response) => {
                if (AppUtils.notNullOrUndefined(response)) {
                    if (response instanceof HttpResponse) {
                        return res.status(response.code).json(response);
                    } else {
                        return res.status(200).json(response);
                    }
                }
            })
            .catch((error) => {
                const response = ErrorHandling.catchError(error);
                res.status(response.code).json(response);
                return;
            });
    });
}
