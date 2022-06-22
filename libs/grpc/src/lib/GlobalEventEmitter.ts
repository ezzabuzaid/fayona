import { EventEmitter } from 'events';
import * as openapi from 'openapi3-ts';
import TypedEventEmitter from 'typed-emitter';

import { IOptions } from './IOptions';

type MessageEvents = {
  schema_added: (schema: {
    schema: openapi.SchemaObject;
    name: string;
  }) => void;
  options: (options: IOptions) => void;
  route_scanned: (name: string, defs: any) => void;
};

export default new EventEmitter() as TypedEventEmitter<MessageEvents>;
