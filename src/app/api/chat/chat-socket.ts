import { Logger } from '@core/utils';
import { PrimaryKey } from "@lib/mongoose";
import { strictAssign, validatePayload } from "@lib/validation";
import { locateSocketIO } from '@shared/common';
import { tokenService } from "@shared/identity";
import { IsInt, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import messagesService from "./messages/messages.service";

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
        strictAssign(this, payload);
    }
}
const log = new Logger('ChatSocket');

(() => {
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
                socket.emit(`saved_${ message.timestamp }`, message.id);
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
})()