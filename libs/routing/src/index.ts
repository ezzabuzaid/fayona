import { Fayona } from '@fayona/core';
import { RequestHandler } from 'express';
import * as glob from 'fast-glob';
import 'reflect-metadata';
import { Injector } from 'tiny-injector';

import { Factory } from './lib/Factory';

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
export * from './lib/Factory';
// FIXME: replace it with correct return type
export * from './lib/Response';

interface IRoutingOptions {
  controllers?: string[];
}
declare module '@fayona/core' {
  export interface IFayona {
    Routing(options?: IRoutingOptions): RequestHandler;
  }
}
const prototype: import('@fayona/core').IFayona = Fayona.prototype as any;

prototype.Routing = function (options?: IRoutingOptions): RequestHandler {
  // Load the controllers so the decorators can be activated.
  if (options?.controllers) {
    glob.sync(options.controllers, { absolute: true }).forEach((filePath) => {
      require(filePath);
    });
  }

  return (...args: any[]) => {
    const factory = Injector.GetRequiredService(Factory);
    const context = Injector.Create();
    const req = factory.GetRequest(...args) as any;
    const res = factory.GetResponse(...args);
    const delegate = factory.GetDelegate(...args);
    const dispose = (): void => Injector.Destroy(context);

    factory.AttachInjector(req, (serviceType) =>
      Injector.GetRequiredService(serviceType, context)
    );

    context.setExtra('request', req);
    context.setExtra('response', res);

    ['error', 'end'].forEach((eventName) => {
      req.on(eventName, dispose);
    });

    delegate();
  };
};
