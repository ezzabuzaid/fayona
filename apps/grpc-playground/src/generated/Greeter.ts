// Original file: apps/grpc-playground/src/assets/protos/name.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { HelloReply as _HelloReply, HelloReply__Output as _HelloReply__Output } from './HelloReply';
import type { HelloRequest as _HelloRequest, HelloRequest__Output as _HelloRequest__Output } from './HelloRequest';

export interface GreeterClient extends grpc.Client {
  SayHello(argument: _HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _HelloRequest, callback: grpc.requestCallback<_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _HelloRequest, callback: grpc.requestCallback<_HelloReply__Output>): grpc.ClientUnaryCall;
  
}

export interface GreeterHandlers extends grpc.UntypedServiceImplementation {
  SayHello: grpc.handleUnaryCall<_HelloRequest__Output, _HelloReply>;
  
}

export interface GreeterDefinition extends grpc.ServiceDefinition {
  SayHello: MethodDefinition<_HelloRequest, _HelloReply, _HelloRequest__Output, _HelloReply__Output>
}
