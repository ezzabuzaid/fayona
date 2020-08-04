import { CrudService, CrudDao, IReadAllOptions, WriteResult } from '@shared/crud';
import { MessagesSchema } from './messages.model';
import { PrimaryKey, Payload } from '@lib/mongoose';
import { Result } from '@core/response';

export class MessagesService extends CrudService<MessagesSchema> {
    constructor() {
        super(new CrudDao(MessagesSchema));
    }

    getLastMessage(room: PrimaryKey, options: IReadAllOptions<MessagesSchema>) {
        return super.all({ room }, {
            ...options,
            sort: {
                order: 'descending'
            }
        });
    }
}

export default new MessagesService();
