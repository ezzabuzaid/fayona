import { WebApplicationBuilder } from '@fayona/core';

declare module '@fayona/core' {
  export interface IWebApplication {
    UseAuthorization(): void;
  }
}

const prototype: import('@fayona/core').IWebApplication =
  WebApplicationBuilder.prototype as any;

prototype.UseAuthorization = function (): void {
  // TODO Add auth middleware here
};
