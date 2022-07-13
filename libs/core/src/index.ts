import { Fayona } from './lib/Fayona/Fayona';
import { IFayona, IFayonaOptions } from './lib/Fayona/IFayona';

export * from './lib/Exceptions/ArgumentException';
export * from './lib/Exceptions/InvalidOperationException';
export * from './lib/Fayona/Fayona';
export * from './lib/Fayona/IFayona';
export * from './lib/Http/HttpContext';
export * from './lib/Http/IHttpContext';
export * from './lib/Metadata';
export * from './lib/Utils/Action';
export * from './lib/Utils/SortFunctor';
export * from './lib/Utils/Utils';

export function CreateFayona(
  options?: IFayonaOptions
): import('@fayona/core').IFayona & IFayona {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Fayona(options);
}
