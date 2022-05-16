import { Fayona } from '@fayona/core';
import { RequestHandler } from 'express';
import * as glob from 'fast-glob';
import 'reflect-metadata';
import { Injector } from 'tiny-injector';

export * from './lib/Decorators/FromBody';
export * from './lib/Decorators/FromHeaders';
export * from './lib/Decorators/FromQuery';
export * from './lib/Decorators/FromRoute';
export * from './lib/Decorators/FromServices';
export * from './lib/Decorators/HttpDelete';
export * from './lib/Decorators/HttpGet';
export * from './lib/Decorators/HttpPatch';
export * from './lib/Decorators/HttpPost';
export * from './lib/Decorators/HttpPut';

export * from './lib/Decorators/Route';

// FIXME: replace it with correct return type
export * from './lib/Response';

declare module '@fayona/core' {
  export interface IFayona {
    Routing(options: { controllers: string[] }): RequestHandler;
  }
}
const prototype: import('@fayona/core').IFayona = Fayona.prototype as any;

prototype.Routing = function (options: {
  controllers: string[];
}): RequestHandler {
  // Load the controllers so the decorators can be activated.
  glob.sync(options.controllers, { absolute: true }).forEach((filePath) => {
    require(filePath);
  });

  return (req, res, next) => {
    const context = Injector.Create();
    const dispose = (): void => Injector.Destroy(context);
    context.setExtra('request', req);
    context.setExtra('response', res);

    req.Inject = (serviceType: any): any =>
      Injector.GetRequiredService(serviceType, context);

    ['error', 'end'].forEach((eventName) => {
      req.on(eventName, dispose);
    });

    next();
  };
};
