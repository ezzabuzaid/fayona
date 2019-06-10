import { Server } from './app/server';
Server.bootstrap();
process.chdir('./src/');
console.log('Node verions is => ', process.version);
