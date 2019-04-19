import { Server, ServerOptions } from 'ws';


class WebSocket extends Server {

    populate(option: ServerOptions) {
        new WebSocket(option);

    }
}

export default new WebSocket;

// wss.on('connection', (ws: WebSocket) => {
//     ws.on('message', (message: string) => {
//         console.log('received: %s', message);
//         ws.send(`Hello, you sent -> ${message}`);
//     });
//     // ws.send('Hi there, I am a WebSocket server');
// });

class Client {
    constructor(
        private ws: WebSocket
    ) {
        
    }
}