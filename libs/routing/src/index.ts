import 'reflect-metadata';
import { ServiceType } from 'tiny-injector';

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
export * from './lib/Decorators/RemoveMiddleware';
export * from './lib/Decorators/Route';
export * from './lib/ExpressToken';
export * from './lib/IRouterDecorationOption';

// FIXME: replace it with correct return type
export * from './lib/Response';

export * from './lib/RoutingWebApplicationExtensions';
export * from './lib/RoutingWebApplicationBuilderExtensions';

// TODO: something to think about
// What if instead of pull the whole routing adaptar (be depndant on it)
// make fayona middleware "app.use(fayona({controllers:[]}))"
// think about it you do not actually need all the .net stuff, becuase routing is already configured well, I mean express and koa and so on.

// this way it can be universal node or deno works the same at the end.

// What about middlewares and auth?
// simply put, fayona can be light as well full framework. for starters, make the routing library only
// to be used as middleware,

// The middlewares feature can be decoupled to be used as seperate library.
// eslint-disable-next-line @typescript-eslint/no-namespace

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      Locate: <T>(serviceType: ServiceType<T>) => T;
    }
  }
}
