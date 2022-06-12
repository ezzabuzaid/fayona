import * as openapi from 'openapi3-ts';
import TypedEventEmitter from 'typed-emitter';

import { IOptions } from './IOptions';

import EventEmitter = require('events');

type MessageEvents = {
  schema_added: (schema: {
    schema: openapi.SchemaObject;
    name: string;
  }) => void;
  options: (options: IOptions) => void;
  route_scanned: (route: openapi.PathsObject[]) => void;
};

export default new EventEmitter() as TypedEventEmitter<MessageEvents>;
