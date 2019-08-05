import csv = require('csv-parser');
import fs = require('fs');
import { Server } from 'http';
import WebSocket, { ServerOptions } from 'ws';
import { WSocket } from './socket';
import { join } from 'path';
import { Stream } from 'stream';

export function loadOHLCcsv(name: string) {
    const stream = fs.createReadStream(join(process.cwd(), 'assets/data', `${name}.csv`))
        .pipe(csv())
        .on('data', (data) => {
            stream.pause();
            setTimeout(() => {
                stream.resume();
            }, 500);
        })
        .on('error', console.log)
        .on('end', () => {
            stream.destroy();
        });
    return stream;
}

export class OLHC {
    public socket: WSocket = null;
    public ws: WebSocket = null;
    constructor(options: ServerOptions) {
        this.socket = new WSocket(options);

    }

    public onConnection() {
        return new Promise<WebSocket>((resolve) => {
            this.socket.on('connection', (ws) => {
                ws.on('error', console.log);
                ws.on('close', console.log);
                ws.on('unexpected-response', console.log);
                this.ws = ws;
                resolve(ws);
            });
        });
    }

    public send(data) {
        this.ws.send(JSON.stringify(data));
    }

}