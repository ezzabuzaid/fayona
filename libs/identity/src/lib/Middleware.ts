import type { RequestHandler } from 'express';
import { Injector } from 'tiny-injector';

import { AuthorizationService } from './AuthorizationService';
import { SecureUserToken } from './Claims/ClaimsPrincipal';
import { Metadata } from './Metadata';

export const AuthorizeMiddlewares: (
  httpEndpointMetadata: HttpEndpointMetadata
) => RequestHandler = (httpEndpointMetadata) => async (req, res, next) => {
  const metadata = Injector.GetRequiredService(Metadata);
  const authorizationService = req.inject(AuthorizationService);
  const polices = metadata.GetPolices(httpEndpointMetadata);
  const result = authorizationService.Authorize(
    await req.inject(SecureUserToken as any),
    polices.map((it) => it.Requirements).flat()
  );
  if (result.Succeeded) {
    next();
  } else {
    console.log(result);
    next(result);
  }
};
