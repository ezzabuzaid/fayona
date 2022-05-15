/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { ClaimsPrincipal } from '@fayona/core';
import {
  AuthenticationProblemDetailsException,
  AuthenticationProperties,
  AuthenticationScheme,
  FromStrategy,
  IAuthenticationHandler,
} from '@fayona/identity';
import { Fayona, HttpContext } from '@fayona/routing';
import * as express from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ProblemDetailsException,
  problemDetailsMiddleware,
} from 'rfc-7807-problem-details';
import {
  Injectable,
  Injector,
  ServiceCollection,
  ServiceLifetime,
} from 'tiny-injector';

import './app/Controllers/ExampleController';

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
        // done(
        //   new ProblemDetailsException({
        //     status: 401,
        //     title: 'Un',
        //   }),
        //   false
        // );
        done(null, new ClaimsPrincipal());
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
// fayona.GetRoutes().forEach((route) => {
//   application.use(route.GetRouter());
// });
application
  .use(express.json())
  .use(
    fayona.Init({
      controllers: [],
    })
  )
  .use(
    fayona['Authentication']((options) => {
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
    if (!res.headersSent) {
      next(new ProblemDetailsException({ status: 404, type: '404' }));
    }
  })
  .use(
    problemDetailsMiddleware.express((configure) => {
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
