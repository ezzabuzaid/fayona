import {
  Server,
  ServerCredentials,
  ServerUnaryCall,
  handleUnaryCall,
  loadPackageDefinition,
  sendUnaryData,
} from '@grpc/grpc-js';
import { join } from 'path';

import protoLoader = require('@grpc/proto-loader');

function loadProto(name: string) {
  const packageDefinition = protoLoader.loadSync(
    join(__dirname, 'assets', 'protos', `${name}.proto`),
    {}
  );
  return loadPackageDefinition(packageDefinition);
}
const sayHello: handleUnaryCall<any, any> = (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  // eslint-disable-next-line prefer-rest-params
  callback(null, { message: 'Hello ' + call.request.name });
};

const helloProto = loadProto('hello');
const server = new Server();
server.addService(helloProto.Greeter['service'], { sayHello });
server.bindAsync(
  '0.0.0.0:50051',
  ServerCredentials.createInsecure(),
  (err: Error | null, bindPort: number) => {
    if (err) {
      throw err;
    }

    console.log(`gRPC:Server:${bindPort}`, new Date().toLocaleString());
    server.start();
  }
);
