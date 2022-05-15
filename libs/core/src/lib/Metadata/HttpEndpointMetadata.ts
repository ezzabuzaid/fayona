import { RequestHandler } from 'express';

import { METHODS } from './Methods';
import { ParameterMetadata } from './ParameterMetadata';

export class HttpEndpointMetadata {
  public readonly Properties = new Map<any, any>();
  public readonly Parameters: ParameterMetadata<any>[] = [];
  public FullPath?: string;
  public FinalHandler?: RequestHandler;

  constructor(
    public readonly controller: Function,
    public handler?: Function,
    public path?: string,
    public method?: METHODS,
    public middlewares: RequestHandler[] = []
  ) {}
}
