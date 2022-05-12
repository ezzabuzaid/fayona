/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { WebApplication } from '@fayona/core';
import '@fayona/routing';
import * as express from 'express';
import * as endpoint from 'express-list-endpoints';

import './app/Controllers/ExampleController';
import * as co from './app/Controllers/ExampleController';
import { IgnoreFavIconMiddleware } from './app/IgnoreFavIconMiddleware';

co.ExampleController;
const expressApp = express();

const builder = WebApplication.CreateBuilder({
  RoutingAdaptar: expressApp,
  Controllers: [],
});

const app = builder.Build();
app.UseMiddleware(IgnoreFavIconMiddleware);
app.UseEndpoint();
const port = process.env.port || 3333;
const server = expressApp.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
// console.log(endpoint(expressApp));
