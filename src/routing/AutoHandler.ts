import { HttpResponse } from '@core/response/generic_response';
import { SuccessResponse } from '@core/response/success_response';
import { notNullOrUndefined } from '@lib/utils';
import { NextFunction, Request, Response } from 'express';

export function autoHandler(...middlewares) {
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
            return res.status(response.status).json(response.toJson());
        }
    });
}
