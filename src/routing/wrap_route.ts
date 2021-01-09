import { Request, Response, NextFunction } from 'express';
import { HttpResponse, SuccessResponse } from 'response';
import { notNullOrUndefined } from 'utils';

export function wrapRoutes(...middlewares) {
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

            // TODO: To be tested
            return send(SuccessResponse.NoContent());
            // throw Error('Void or Promise<Void> cannot work, please return something');
        } catch (error) {
            next(error);
        }

        function send(response: HttpResponse) {
            return res.status(response.code).json(response);
        }
    });
}
