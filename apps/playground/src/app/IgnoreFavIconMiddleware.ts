import { HttpContext } from '@fayona/core';
import { Middleware } from '@fayona/core';
import { NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export class IgnoreFavIconMiddleware extends Middleware {
  public async Invoke(context: HttpContext, next: NextFunction): Promise<void> {
    console.log('IgnoreFavIconMiddleware');
    console.log(context.Request.url.split('/').at(-1));
    if (context.Request.url.split('/').at(-1) === 'favicon.ico') {
      context.Response.status(StatusCodes.NO_CONTENT).send({});
      console.log('IgnoreFavIconMiddleware');
      return;
    }
    next();
  }
}
