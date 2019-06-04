import { IncomingMessage } from 'http';
import WebSocket from 'ws';
import { AppUtils } from '../utils/utils.service';
interface Test {
    Role: string;
    ws: WebSocket;
    id: string;
    name: string;
}
export class Socket {
    constructor(server) {

        const clients: Test[] = [];
        const wss = new WebSocket.Server({ server });
        wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            ws.send(JSON.stringify(AppUtils.generateHash()));
            ws.on('error', (e) => {
                console.log('error', e);
                // clients.splice(clients.findIndex(el=>e.id),1)
            });
            ws.on('close', (e) => {
                console.log('close', e);
                // wss.clients.has(ws)
            });
            ws.on('message', (message: Test) => {
                console.log('received: %s', message);
                // TODO type of message control
                clients.push({
                    ws,
                    Role: message.Role,
                    name: message.name,
                    id: (req.headers['Sec-WebSocket-Accept'] as string),
                });
                // TODO when a client is coming or going reinvoke this expressions with latest change (firebase like)
                if (message.Role === 'controller') {
                    const outgoingMessage = clients.filter((client) => client.Role !== 'controller').map((el) => ({ id: el.id }));
                    ws.send(JSON.stringify(outgoingMessage));

                }
            });
        });
    }
}
