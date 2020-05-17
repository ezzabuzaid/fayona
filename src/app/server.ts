import { Database } from '@core/database';
import { StageLevel } from '@core/helpers';
import { Logger, LoggerLevel, AppUtils } from '@core/utils';
import { envirnoment } from '@environment/env';
import http = require('http');
import { URL } from 'url';
import { Application } from './app';
import socketIO from 'socket.io';
import stage from '@core/helpers/stage';
import messagesService from '@api/chat/messages/messages.service';
import { IsString, IsMongoId, IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { validatePayload } from '@shared/common';
import { PrimaryKey } from '@lib/mongoose';
import { tokenService } from '@shared/identity';

const log = new Logger('Server');

interface IRoom {
        id: PrimaryKey;
}

class MessagePayload {
        @IsString()
        @IsNotEmpty()
        public text: string = null;

        @IsMongoId()
        public id: PrimaryKey = null;

        @IsInt()
        public order = null;

        @IsNumber()
        public timestamp = null;

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
                const database = await NodeServer.loadDatabase();
                // TODO: Move this out
                const io = socketIO(server.server);
                io.use(async (socket, next) => {
                        try {
                                socket['decodedToken'] = await tokenService.decodeToken(socket.handshake.query.token);
                        } catch (error) {
                                next(new Error('Authentication error'));
                        }
                        next();
                });

                io.on('connection', (socket) => {
                        socket.on('Join', async (room: IRoom) => {
                                log.debug('New Joiner => ', room.id);
                                socket.join(room.id as any);
                        });
                        socket.on('Leave', async (room: IRoom) => {
                                log.debug('New Joiner => ', room.id);
                                socket.leave(room.id as any);
                        });
                        socket.on('error', () => {
                                socket.leaveAll();
                        });
                        socket.on('SendMessage', async (message: MessagePayload) => {
                                const { id } = socket['decodedToken'];
                                log.debug('New Message from => ', message, typeof message.text);
                                const payload = new MessagePayload(message);
                                try {
                                        await validatePayload(payload);
                                        const createdMessage = await messagesService.createMessage({
                                                room: payload.id,
                                                user: id,
                                                text: payload.text,
                                                order: message.order
                                        });
                                        socket.emit(`saved_${message.timestamp}`, message.id);
                                        socket.broadcast.in(message.id as any).emit('Message', createdMessage.data);
                                } catch (error) {
                                        console.log('MessageValidationError => ', error);
                                        socket.emit('MessageValidationError', message);
                                }
                        });
                        socket.on('StreamOffer', ({ negotiation, id }: { id: string, negotiation }) => {
                                socket.broadcast.in(id as any).emit('StreamAnswer', negotiation);
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
                if (AppUtils.isNullOrUndefined(this.server)) {
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
