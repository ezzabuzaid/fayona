import * as express from 'express';
import { join } from 'path';

import { InvalidOperationException } from '../Exceptions/InvalidOperationException';
import { IsNullOrUndefined } from '../Utils/Utils';
import { HttpEndpointMetadata } from './HttpEndpointMetadata';

export class HttpRouteMetadata {
  public EndpointMap = new Map<string, HttpEndpointMetadata>();
  constructor(
    public readonly controller: Function,
    public router?: ReturnType<typeof express.Router>,
    public path?: string,
    public readonly endpoints: HttpEndpointMetadata[] = []
  ) {}

  public GetPath(): string {
    if (IsNullOrUndefined(this.path)) {
      throw new InvalidOperationException(
        `${this.controller.name} is not registerd yet. You can only call this method after calling WebApplicaiton.Build`
      );
    }
    return this.path;
  }

  public GetRouter(): ReturnType<typeof express.Router> {
    if (IsNullOrUndefined(this.router)) {
      throw new InvalidOperationException(
        `${this.controller.name} is not registerd yet. You can only call this method after calling WebApplicaiton.Build`
      );
    }
    return this.router;
  }

  public SetRouter(
    router: ReturnType<typeof express.Router>,
    path: string
  ): void {
    this.router = router;
    this.path = path;

    for (const endpoint of this.endpoints) {
      this.EndpointMap.set(join(this.GetPath(), endpoint.path!), endpoint);
    }
  }
}
