import { Request, Response, NextFunction } from 'express';
import { HttpResponse, SuccessResponse } from 'response';
import { notNullOrUndefined } from 'utils';

export function wrapRoutes(...middlewares) {
    return middlewares.map((middleware) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await middleware(req, res, next);
            if (notNullOrUndefined(response)) {
                if (response instanceof HttpResponse) {
                    return res.status(response.code).json(response);
                } else {
                    const implictResponse = SuccessResponse.Ok(response)
                    return res.status(implictResponse.code).json(implictResponse);
                }
            }
            // throw Error('Void or Promise<Void> cannot work, please return something');
        } catch (error) {
            next(error);
        }
    });
}
