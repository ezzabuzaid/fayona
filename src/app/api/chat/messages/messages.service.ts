import { CrudService, Repo, IReadAllOptions, WriteResult } from '@shared/crud';
import { MessagesSchema } from './messages.model';
import { PrimaryKey, Payload } from '@lib/mongoose';
import { Result } from '@core/response';

export class MessagesService extends CrudService<MessagesSchema> {
    constructor() {
        super(new Repo(MessagesSchema));
    }

    getLastMessage(room: PrimaryKey, options: IReadAllOptions<MessagesSchema>) {
        return super.all({ room }, {
            ...options,
            sort: {
                order: 'descending'
            }
        });
    }

    async createMessage(payload: Payload<MessagesSchema>) {
        const message = await super.create(payload);
        const result = new Result<WriteResult & Partial<MessagesSchema>>({ ...message, ...payload });
        return result;
    }
}

export default new MessagesService();
