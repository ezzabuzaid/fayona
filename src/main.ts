import { NodeServer } from './app/server';
NodeServer.bootstrap();
process.chdir('./src/');
console.log('Node verions is => ', process.version);
