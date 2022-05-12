import {
  CoreInjector,
  HttpContext,
  InvalidOperationException,
  Middleware,
  ParameterType,
} from '@fayona/core';
import { Metadata } from '@fayona/core';

import { FromBodyModelBinding } from '../ModelBinding/FromBodyModelBinding';
import { FromHeaderModelBinding } from '../ModelBinding/FromHeaderModelBinding';
import { FromQueryModelBinding } from '../ModelBinding/FromQueryModelBinding';
import { FromRouteModelBinding } from '../ModelBinding/FromRouteModelBinding';
import { FromServiceModelBinding } from '../ModelBinding/FromServiceModelBinding';

// const endpointHandler = async function (
//   httpEndpointMetadata: HttpEndpointMetadata,
//   request: Request
// ): Promise<void> {
//   const metadata = CoreInjector.GetRequiredService(Metadata);
//   const parameters = [];
//   const endpointParameters = metadata
//     .GetHttpEndpointParameters(httpEndpointMetadata.GetHandlerName())
//     .reverse();
//   for (const parameterMetadata of endpointParameters) {
//     switch (parameterMetadata.Type) {
//       case ParameterType.FROM_HEADER:
//         const modelBinding = new FromHeaderModelBinding(
//           parameterMetadata,
//           request.headers
//         );
//         parameters[parameterMetadata.Index] = modelBinding.Bind();
//         break;
//       case ParameterType.FROM_ROUTE:
//         const fromRouteModelBinding = new FromRouteModelBinding(
//           parameterMetadata,
//           request.params
//         );
//         parameters[parameterMetadata.Index] = fromRouteModelBinding.Bind();
//         break;
//       case ParameterType.FROM_QUERY:
//         const fromQueryModelBinding = new FromQueryModelBinding(
//           parameterMetadata,
//           request.query
//         );
//         parameters[parameterMetadata.Index] = fromQueryModelBinding.Bind();
//         break;
//       case ParameterType.FROM_SERVICES:
//         const fromServiceModelBinding = new FromServiceModelBinding(
//           parameterMetadata,
//           CoreInjector.GetRequiredService(parameterMetadata.Payload)
//         );
//         parameters[parameterMetadata.Index] = fromServiceModelBinding.Bind();
//         break;
//       case ParameterType.FROM_BODY:
//         const fromBodyModelBinding = new FromBodyModelBinding(
//           parameterMetadata,
//           request.body
//         );
//         parameters[parameterMetadata.Index] = fromBodyModelBinding.Bind();
//         break;
//       default:
//         throw new InvalidOperationException(
//           'An unspported HTTP decorator was used, please report the issue ASAP.'
//         );
//     }
//   }
//   const controllerInstance = RoutingInjector.GetRequiredService(
//     httpEndpointMetadata.controller
//   );
//   return httpEndpointMetadata.handler.apply(
//     controllerInstance,
//     parameters as []
//   );
// };
