import { Context, Injector } from 'tiny-injector';

import { IFayona } from './IFayona';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class Fayona implements IFayona {
  // [method: string]: any;

  constructor() {
    Injector.AddScoped(Context, (context) => context);
  }
}
