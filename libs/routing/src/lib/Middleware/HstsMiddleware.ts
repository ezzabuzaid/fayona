import { HttpContext } from '@fayona/core';
import { NextFunction } from 'express';

export class HstsMiddlware {
  public async Invoke(context: HttpContext, next: NextFunction): Promise<void> {
    if (context.Request.secure) {
      context.Response.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
    next();
  }
}
