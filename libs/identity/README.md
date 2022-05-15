# TBD

## Experiments

## JWT Strategy

```typescript
import { ClaimsPrincipal } from '@fayona/core';
import {
  AuthenticationMiddleware,
  AuthenticationProblemDetailsException,
  AuthenticationProperties,
  AuthenticationScheme,
  FromStrategy,
  IAuthenticationHandler,
} from '@fayona/identity';
import { Fayona } from '@fayona/routing';
import * as express from 'express';
import { sign } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ProblemDetailsException,
  problemDetailsMiddleware,
} from 'rfc-7807-problem-details';
import { Injectable, ServiceLifetime } from 'tiny-injector';

import './app/Controllers/ExampleController';

console.log(
  sign({ foo: 'bar' }, 'shhhhh', {
    expiresIn: 10000,
  })
);

@Injectable({
  lifetime: ServiceLifetime.Transient,
})
class JwtBearerHandler extends IAuthenticationHandler {
  constructor(private _fromStrategy: FromStrategy<typeof Strategy>) {
    super();
  }
  public Authenticate(): Promise<ClaimsPrincipal> {
    return this._fromStrategy.Authenticate(
      Strategy,
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'shhhhh',
      },
      (payload, done) => {
        done(
          new ProblemDetailsException({
            status: 401,
            title: 'Un',
          }),
          false
        );
        // done(null, new ClaimsPrincipal());
      }
    );
  }

  public Challenge(properties?: AuthenticationProperties): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public Forbid(properties?: AuthenticationProperties): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

const fayona = new Fayona();
const application = express();

fayona.GetRoutes().forEach((route) => {
  application.use(route.GetRouter());
});

application
  .use(express.json())
  .use(fayona.Init({ controllers: [] }))
  .use(
    AuthenticationMiddleware((options) => {
      options.DefaultAuthenticateScheme = 'Bearer'; // must be added
      options.AddScheme(
        new AuthenticationScheme(JwtBearerHandler, 'Bearer', 'JWT Bearer')
      );
      options.AddScheme(
        new AuthenticationScheme(
          JwtBearerHandler,
          'Firebase',
          'Firebase Authentication'
        )
      );
    })
  );

fayona.GetEndpoints().forEach((endpoint) => {
  application[endpoint.method](endpoint.FullPath, endpoint.FinalHandler);
});

application
  .use((req, res, next) => {
    next({
      statusCode: 404,
    });
  })
  .use(
    problemDetailsMiddleware((configure) => {
      configure.map(
        AuthenticationProblemDetailsException,
        () => true,
        (error) => {
          error.Details.type = 'recite';
          return error.Details;
        }
      );
    })
  );
const port = process.env.port || 3333;
const server = application.listen(port);
```

2. Use custom strategy (firebase)
3. Login with facebook
4. Login with twitter
5. Login with google
