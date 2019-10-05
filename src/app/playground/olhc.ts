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

    public onError() {
        return new Promise((resolve) => {
            this.socket.on('error', () => {
                resolve(void 0);
            });
        });
    }

}

const socketList = ['cad', 'gbp', 'eurusd', 'jpy'];
const sockets: { [index: string]: OLHC } = socketList.reduce((acc, current) => {
    acc[current] = new OLHC({ noServer: true });
    return acc;
}, {});

export function handleSocket(req, res) {
    const { name } = req.params;
    const stream = loadOHLCcsv(name);
    const socket = sockets[name];
    socket.onConnection()
        .then((ws) => {
            function handler(data) {
                if (ws.readyState === ws.OPEN) {
                    // socket.socket.clients.forEach((client) => {
                    //         client.send(JSON.stringify({ data, name }));
                    // });
                }
            }
            // const streamListener = stream.on('data', handler);
            ws.on('close', () => {
                console.log('CLOSE');
                // streamListener.removeListener('data', handler);
            });
        });
    socket.onError()
        .then(() => {
            console.log('ERROR');
            stream.destroy();
        });
    // httpServer.once('upgrade', (request, _socket, head) => {
    //         socket.socket.handleUpgrade(request, _socket, head, (ws) => {
    //                 socket.socket.emit('connection', ws, request);
    //         });
    // });
    res.status(200).send({ success: true });
}
