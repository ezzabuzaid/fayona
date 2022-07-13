import { Context, Injector } from 'tiny-injector';

import { IFayona, IFayonaOptions } from './IFayona';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class Fayona implements IFayona {
  constructor(private Options?: IFayonaOptions) {
    Injector.TryAddScoped(Context, (context) => context);
  }
}
