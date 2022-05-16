import { HttpEndpointMetadata, HttpRouteMetadata } from '../Metadata';

export interface IFayona {
  GetEndpoints(): HttpEndpointMetadata[];
  GetRoutes(): HttpRouteMetadata[];
}
