import { HttpContext } from '@fayona/core';
import { Middleware } from '@fayona/core';
import { NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export class IgnoreFavIconMiddleware extends Middleware {
  public async Invoke(context: HttpContext, next: NextFunction): Promise<void> {
    if (context.Request.url.split('/').at(-1) === 'favicon.ico') {
      context.Response.status(StatusCodes.NO_CONTENT).send({});
      return;
    }
    next();
  }
}
