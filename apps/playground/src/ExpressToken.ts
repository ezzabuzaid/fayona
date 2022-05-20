import { CreateFayona } from '@fayona/core';
import { AuthenticationScheme } from '@fayona/identity';
import * as express from 'express';
import { InjectionToken, ServiceLifetime } from 'tiny-injector';

import { JwtBearerHandler } from './JwtBearerHandler';

export const EXPRESS_TOKEN = new InjectionToken<ReturnType<typeof express>>(
  'Token For The Middleware Adaptar (Express)',
  {
    lifetime: ServiceLifetime.Singleton,
    implementationFactory: () => {
      const fayona = CreateFayona();
      return express()
        .use(express.json())
        .use(
          fayona.Routing({
            controllers: [],
          })
        )
        .use(
          fayona.Authentication((options) => {
            options.DefaultAuthenticateScheme = 'Bearer'; // must be added
            // options.AddScheme(
            //   new AuthenticationScheme(JwtBearerHandler, 'Bearer', 'JWT Bearer')
            // );
          })
        );
    },
  }
);
