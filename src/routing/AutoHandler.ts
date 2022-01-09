import { NextFunction, Request, Response } from 'express';
import { HttpResponse, SuccessResponse } from '../Response';
import { notNullOrUndefined } from '../utils';

export function autoHandler(...middlewares: any[]) {
    return middlewares.map((middleware) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await middleware(req, res, next);
            if (notNullOrUndefined(response)) {
                if (response instanceof HttpResponse) {
                    return send(response)
                } else {
                    return send(SuccessResponse.Ok(response))
                }
            }
            // if there's no response that means next() has been called.
        } catch (error) {
            next(error);
        }

        function send(response: HttpResponse) {
            return res.status(response.statusCode).json(response.toJson());
        }
    });
}
