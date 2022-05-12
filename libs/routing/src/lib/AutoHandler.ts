import { NotNullOrUndefined } from '@fayona/core';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import { HttpResponse, SuccessResponse } from './Response';

// FIXME: refactory to .net Middleware
export function AutoHandler(...middlewares: any[]): RequestHandler[] {
  return middlewares.map(
    (middleware) => async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await middleware(req, res, next);
        if (NotNullOrUndefined(response)) {
          if (response instanceof HttpResponse) {
            Send(response);
            return;
          } else {
            Send(SuccessResponse.Ok(response));
            return;
          }
        }
        return;
        // if there's no response that means next() has been called.
      } catch (error) {
        next(error);
      }

      function Send(response: HttpResponse): Response {
        return res.status(response.StatusCode).json(response.ToJson());
      }
    }
  );
}
