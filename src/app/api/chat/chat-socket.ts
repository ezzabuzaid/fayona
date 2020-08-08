import { Logger } from '@core/utils';
import { PrimaryKey } from '@lib/mongoose';
import { strictAssign, validatePayload } from '@lib/validation';
import { locateSocketIO } from '@shared/common';
import { tokenService } from '@shared/identity';
import { IsInt, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import messagesService from './messages/messages.service';

interface IRoom {
    id: string;
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
        strictAssign(this, payload);
    }
}
const log = new Logger('ChatSocket');

export function startChatSocket() {
    const io = locateSocketIO();
    io.use(async (socket, next) => {
        try {
            socket['decodedToken'] = await tokenService.decodeToken(socket.handshake.query.token);
        } catch (error) {
            next(new Error('Authentication error'));
        }
        next();
    });

    io.on('connection', (socket) => {
        function leave(id, type) {
            id ? socket.leave(id) : socket.leaveAll();
            log.debug(type);
            log.warn(socket.rooms);
        }
        socket.on('disconnect', () => {
            leave(null, 'Disconnect');
        });
        socket.on('error', () => {
            leave(null, 'Error');
        });
        socket.once('Leave', async (room: IRoom) => {
            leave(room.id, 'Leave');
        });
        socket.once('Join', async (room: IRoom) => {
            log.debug('New Joiner => ', room.id);
            socket.join(room.id);
        });
        socket.on('SendMessage', async (message: MessagePayload) => {
            const { id } = socket['decodedToken'];
            const payload = new MessagePayload(message);
            try {
                await validatePayload(payload);
                const createdMessage = await messagesService.create({
                    room: payload.id,
                    user: id,
                    text: payload.text,
                    order: payload.order
                });
                socket.emit(`saved_${ message.timestamp }`, message.id);
                io.sockets.to(payload.id as any).emit('Message', createdMessage.data);
                log.debug('New Message => ', createdMessage.data);
            } catch (error) {
                console.log('MessageValidationError => ', error);
                socket.emit('SendMessageError', error);
            }
        });
        socket.on('MakeCallNegotiation', (negotiation: CallNegotiation) => {
            log.debug('MakeCallNegotiation', negotiation.id);
            socket.to(negotiation.id).emit('CallNegotiationMade', negotiation);
        });
        socket.on('AcceptCallNegotiation', (negotiation: CallNegotiation) => {
            log.debug('AcceptCallNegotiation', negotiation.id);
            socket.to(negotiation.id).emit('AcceptedCallNegotiation', negotiation);
        });
        socket.on('CallerCandidate', (negotiation: CallNegotiation) => {
            log.debug('candidate', negotiation);
            socket.to(negotiation.id).emit('CalleeCandidate', negotiation);
        });
    });
}
export class CallNegotiation {
    constructor(
        public negotiation: any,
        public id: string
    ) { }
}
