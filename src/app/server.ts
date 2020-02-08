import { Database } from '@core/database';
import { stage, StageLevel } from '@core/helpers';
import { Logger, LoggerLevel, AppUtils } from '@core/utils';
import { envirnoment } from '@environment/env';
import http = require('http');
import { URL } from 'url';
import { Application } from './app';
import socketIO from 'socket.io';

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
                envirnoment.load();
                const server = new NodeServer();
                await NodeServer.loadDatabase();
                const rooms = {};
                socketIO(server.server)
                        .on('connection', (socket) => {
                                socket.on('JoinRoom', (room: IRoom) => {
                                        rooms[room.sender_id] = socket;
                                        console.log('New Room => ', room.sender_id);
                                });
                                socket.on('SendMessage', (message: IMessage) => {
                                        console.log('New Message', message);
                                        const recipientSocket = rooms[message.recipient_id];
                                        if (recipientSocket) {
                                                recipientSocket.emit('Message', message);
                                        }
                                });
                        });
                return server;
        }

        public static async test() {
                Logger.level = LoggerLevel.Off;
                envirnoment.load(StageLevel.TEST);
                // FIXME new Application()).application shouldn't be created here
                return [
                        await NodeServer.loadDatabase(),
                        (new Application()).application
                ];
        }

        /**
         *
         * Start the server and return an instance of it.
         * @returns {Promise<httpServer>}
         */
        private populateServer() {
                //     key: fs.readFileSync('./key.pem'),
                //     cert: fs.readFileSync('./cert.pem'),
                //     passphrase: 'YOUR PASSPHRASE HERE'
                if (AppUtils.isFalsy(this.server)) {
                        this.server = http.createServer(this.application);
                }
                this.startServer();
        }

        private startServer() {
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
