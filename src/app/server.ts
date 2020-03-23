import { Database } from '@core/database';
import { StageLevel } from '@core/helpers';
import { Logger, LoggerLevel, AppUtils } from '@core/utils';
import { envirnoment } from '@environment/env';
import http = require('http');
import { URL } from 'url';
import { Application } from './app';
import socketIO from 'socket.io';
import stage from '@core/helpers/stage';
import messagesService from '@api/conversations/messages.service';
import { IsString, IsMongoId } from 'class-validator';
import { validatePayload } from '@shared/common';

const log = new Logger('Server init');

interface IRoom {
        recipient_id: string;
        sender_id: string;
}

class Message {
        constructor(
                public text: string,
                public conversation: string,
                public sender_id: string,
                public recipient_id: string
        ) { }
}

class MessagePayload {
        @IsString()
        public text: string = null;
        @IsMongoId()
        public conversation: string = null;
        @IsMongoId()
        public sender_id: string = null;
        @IsMongoId()
        public recipient_id: string = null;

        constructor(payload: MessagePayload) {
                AppUtils.strictAssign(this, payload);
        }
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
                envirnoment.load(StageLevel.DEV);
                const server = new NodeServer();
                await NodeServer.loadDatabase();
                const sockets: { [key: string]: socketIO.Socket } = {};
                // TODO: Move this out
                socketIO(server.server)
                        .on('connection', (socket) => {
                                socket.on('JoinRoom', async (room: IRoom) => {
                                        sockets[room.sender_id] = socket;
                                });
                                socket.on('SendMessage', async (message: Message) => {
                                        const payload = new MessagePayload(message);
                                        try {
                                                await validatePayload(payload);
                                                const createdMessage = await messagesService.create({
                                                        conversation: payload.conversation,
                                                        user: payload.sender_id,
                                                        text: payload.text
                                                });
                                                const newMessage = await messagesService.one({
                                                        _id: createdMessage.data.id
                                                });
                                                const recipientSocket = sockets[payload.recipient_id];
                                                if (recipientSocket && recipientSocket.connected) {
                                                        recipientSocket.emit('Message', newMessage);
                                                } else {
                                                        sockets[payload.recipient_id] = undefined;
                                                }
                                                socket.emit('Message', newMessage);
                                        } catch (error) {
                                                socket.emit('MessageValidationError', message);
                                        }
                                });
                                socket.on('JoinGroup', (room: IRoom) => {
                                        console.log('New Group Joiner => ', room.recipient_id);
                                        socket.join(room.recipient_id);
                                });
                                socket.on('SendGroupMessage', (message: Message) => {
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
