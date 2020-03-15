import { Database } from '@core/database';
import { StageLevel } from '@core/helpers';
import { Logger, LoggerLevel, AppUtils } from '@core/utils';
import { envirnoment } from '@environment/env';
import http = require('http');
import { URL } from 'url';
import { Application } from './app';
import socketIO from 'socket.io';
import stage from '@core/helpers/stage';

const log = new Logger('Server init');

interface IRoom {
        recipient_id: string;
        sender_id: string;
}

interface IMessage extends IRoom {
        message: string;
}
export class NodeServer extends Application {
        private port = +envirnoment.get('PORT') || 8080;
        private host = envirnoment.get('HOST') || '127.0.0.1';
        private server: http.Server = null;
        public path: URL = null;

        private constructor() {
                super();
                this.path = new URL(`http://${this.host}:${this.port}`);
                this.populateServer();
        }

        public static async bootstrap() {
                envirnoment.load(StageLevel.PROD);
                const server = new NodeServer();
                await NodeServer.loadDatabase();
                const sockets: { [key: string]: socketIO.Socket } = {};
                // TODO: Move this out
                socketIO(server.server)
                        .on('connection', (socket) => {
                                socket.on('JoinRoom', (room: IRoom) => {
                                        sockets[room.sender_id] = socket;
                                        console.log('New Room => ', room.sender_id);
                                });
                                socket.on('SendMessage', (message: IMessage) => {
                                        console.log('New Message', message);
                                        const recipientSocket = sockets[message.recipient_id];
                                        // TODO after validating the message save it in the database
                                        if (recipientSocket && recipientSocket.connected) {
                                                recipientSocket.emit('Message', message);
                                        } else {
                                                sockets[message.recipient_id] = undefined;
                                        }
                                });
                                socket.on('JoinGroup', (room: IRoom) => {
                                        console.log('New Group Joiner => ', room.recipient_id);
                                        socket.join(room.recipient_id);
                                });
                                socket.on('SendGroupMessage', (message: IMessage) => {
                                        console.log('New Group Message from => ', message.sender_id);
                                        socket.to(message.recipient_id).emit('Message', message);
                                });
                        });

                return server;
        }

        public static test() {
                Logger.level = LoggerLevel.Off;
                envirnoment.load(StageLevel.TEST);
        }

        /**
         *
         * Start the server and return an instance of it.
         * @returns {Promise<httpServer>}
         */
        private populateServer(): void {
                //     key: fs.readFileSync('./key.pem'),
                //     cert: fs.readFileSync('./cert.pem'),
                //     passphrase: 'YOUR PASSPHRASE HERE'
                if (AppUtils.isFalsy(this.server)) {
                        this.server = http.createServer(this.application);
                }
                this.startServer();
        }

        private startServer(): void {
                this.server.listen(this.path.port, +this.path.hostname, () => {
                        log.info(`${new Date()} Server running at ${this.path.href}`);
                });
        }

        public static loadDatabase() {
                const {
                        MONGO_USER: user,
                        MONGO_PASSWORD: password,
                        MONGO_PATH: path,
                        MONGO_HOST: host
                } = envirnoment.env;
                try {
                        return Database.load({ user, password, path, host, atlas: stage.production });
                } catch (error) {
                        throw new Error(`Faild to init the server ${error}`);
                }
        }

}
