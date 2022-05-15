import { ServiceType } from 'tiny-injector';

export * from './lib/Exceptions/ArgumentException';
export * from './lib/Exceptions/InvalidOperationException';

export * from './lib/Utils/Action';
export * from './lib/Utils/Utils';
export * from './lib/Utils/SortFunctor';

export * from './lib/Claims';

export * from './lib/Metadata';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      Inject: <T>(serviceType: ServiceType<T>) => T;
    }
  }
}
