import {
  CoreInjector,
  HttpContext,
  Middleware,
  ParameterType,
} from '@fayona/core';
import { InvalidOperationException } from 'tiny-injector';

import { FromBodyModelBinding } from '../ModelBinding/FromBodyModelBinding';
import { FromHeaderModelBinding } from '../ModelBinding/FromHeaderModelBinding';
import { FromQueryModelBinding } from '../ModelBinding/FromQueryModelBinding';
import { FromRouteModelBinding } from '../ModelBinding/FromRouteModelBinding';
import { FromServiceModelBinding } from '../ModelBinding/FromServiceModelBinding';
import { HttpResponse } from '../Response';

export class EndpointMiddleware extends Middleware {
  public async Invoke(context: HttpContext, next: any): Promise<void> {
    const httpEndpointMetadata = context.GetMetadata();
    if (!httpEndpointMetadata) {
      await next();
      return;
    }
    const request = context.Request;
    const parameters: any[] = [];
    const endpointParameters = httpEndpointMetadata.Parameters.reverse();

    for (const parameterMetadata of endpointParameters) {
      switch (parameterMetadata.Type) {
        case ParameterType.FROM_HEADER:
          const modelBinding = new FromHeaderModelBinding(
            parameterMetadata,
            request.headers
          );
          parameters[parameterMetadata.Index] = modelBinding.Bind();
          break;
        case ParameterType.FROM_ROUTE:
          const fromRouteModelBinding = new FromRouteModelBinding(
            parameterMetadata,
            request.params
          );
          parameters[parameterMetadata.Index] = fromRouteModelBinding.Bind();
          break;
        case ParameterType.FROM_QUERY:
          const fromQueryModelBinding = new FromQueryModelBinding(
            parameterMetadata,
            request.query
          );
          parameters[parameterMetadata.Index] = fromQueryModelBinding.Bind();
          break;
        case ParameterType.FROM_SERVICES:
          const fromServiceModelBinding = new FromServiceModelBinding(
            parameterMetadata,
            CoreInjector.GetRequiredService(parameterMetadata.Payload)
          );
          parameters[parameterMetadata.Index] = fromServiceModelBinding.Bind();
          break;
        case ParameterType.FROM_BODY:
          const fromBodyModelBinding = new FromBodyModelBinding(
            parameterMetadata,
            request.body
          );
          parameters[parameterMetadata.Index] = fromBodyModelBinding.Bind();
          break;

        default:
          throw new InvalidOperationException(
            'An unspported HTTP decorator was used.'
          );
      }
    }

    const controllerInstance = context.RequestServices.GetRequiredService(
      httpEndpointMetadata.controller
    );

    // FIXME: catch exception here and return problem details in case of failure
    const endpointResponse = httpEndpointMetadata.handler!.apply(
      controllerInstance,
      parameters as []
    ) as unknown as HttpResponse;
    // FIXME: make it clear that all endpoint should return response of type HttpResponse

    context.Response.status(endpointResponse.StatusCode).json(
      endpointResponse.ToJson()
    );
    await next();
  }
}
