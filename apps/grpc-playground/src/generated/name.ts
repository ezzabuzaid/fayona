import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GreeterClient as _GreeterClient, GreeterDefinition as _GreeterDefinition } from './Greeter';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Greeter: SubtypeConstructor<typeof grpc.Client, _GreeterClient> & { service: _GreeterDefinition }
  HelloReply: MessageTypeDefinition
  HelloRequest: MessageTypeDefinition
}

