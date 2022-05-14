/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { WebApplication } from '@fayona/core';
import '@fayona/routing';
import * as express from 'express';
import { problemDetailsMiddleware } from 'rfc-7807-problem-details';

import './app/Controllers/ExampleController';
import * as co from './app/Controllers/ExampleController';
import { IgnoreFavIconMiddleware } from './app/IgnoreFavIconMiddleware';

co.ExampleController;
const expressApp = express();
expressApp.use(express.json());
const builder = WebApplication.CreateBuilder({
  RoutingAdaptar: expressApp,
  Controllers: [],
});

const app = builder.Build();
app.UseMiddleware(IgnoreFavIconMiddleware);
expressApp.use((req, res, next) => {
  next({
    statusCode: 404,
  });
});
expressApp.use(
  problemDetailsMiddleware((options) => {
    //
  })
);
const port = process.env.port || 3333;
const server = expressApp.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
