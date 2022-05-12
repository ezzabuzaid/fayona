import { MakeHandlerName } from '../Utils/Utils';

export class HttpEndpointMiddlewareMetadata {
  constructor(
    public middleware: () => any,
    public controller: Function,
    public handler: () => void
  ) {}

  public GetHandlerName(): string {
    return MakeHandlerName(this.controller, this.handler.name);
  }
}
