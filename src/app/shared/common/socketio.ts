import { locate, Locator } from '@lib/locator';
import socketIO from 'socket.io';

export class Socket { }

export function locateSocketIO() {
    return locate<ReturnType<typeof socketIO>>(Socket as any);
}

export function registerSocket(server) {
    Locator.instance.registerSingelton(socketIO(server), Socket);
}
