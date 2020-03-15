import { NodeServer } from './app/server';

NodeServer.bootstrap()
    .then(() => {
        console.log('Node verions is => ', process.version);
        console.log('Node title is => ', process.title);
    });
