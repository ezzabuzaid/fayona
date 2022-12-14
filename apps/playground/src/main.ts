import './RouteFactory';

import {
  ProblemDetailsException,
  problemDetailsMiddleware,
} from 'rfc-7807-problem-details';
import { Injector } from 'tiny-injector';

import '@fayona/core';
import '@fayona/identity';
import '@fayona/routing';

import { EXPRESS_TOKEN } from './ExpressToken';
import './app/Controllers';

const application = Injector.GetRequiredService(EXPRESS_TOKEN);

application
  .use((req, res, next) => {
    if (!res.headersSent) {
      next(new ProblemDetailsException({ status: 404, type: '404' }));
    }
  })
  .use(
    problemDetailsMiddleware.express((configure) => {
      if (process.env['NODE_ENV'] === 'development') {
        configure.rethrow(Error);
      }
      configure.mapToStatusCode(Error, 500);
    })
  );

const port = process.env.port || 3333;
const server = application.listen(port);
console.log(`${new Date()} Server running at http://localhost:${port}`);
