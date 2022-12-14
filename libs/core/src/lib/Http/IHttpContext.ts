import { Request, Response } from 'express';

import { HttpEndpointMetadata } from '../Metadata';

export interface IHttpContext {
  Response: Response;
  Request: Request;
  GetMetadata(): HttpEndpointMetadata | null;
}
