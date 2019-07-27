import csv = require('csv-parser');
import fs = require('fs');
import { Server } from 'http';
import WebSocket from 'ws';
import { WSocket } from './socket';
import { join } from 'path';

export function loadOHLCcsv() {
    const stream = fs.createReadStream(join(__dirname, 'grm_orders.csv'))
        .pipe(csv())
        .on('data', (data) => {
            stream.pause();
            setTimeout(() => {
                stream.resume();
            }, 1000);
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
    constructor(server: Server) {
        this.socket = new WSocket(server);

    }

    public onConnection() {
        return new Promise((resolve) => {
            this.socket.on('connection', (ws) => {
                ws.on('error', console.log);
                ws.on('close', console.log);
                this.ws = ws;
                resolve(ws);
            });
        });
    }

    public send(data) {
        this.ws.send(JSON.stringify(data));
    }

}