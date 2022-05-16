import { HttpEndpointMetadata } from '@fayona/core';
import { Request, Response } from 'express';

export interface IHttpContext {
  Response: Response;
  Request: Request;
  GetMetadata(): HttpEndpointMetadata | null;
}
