import { CrudService, Repo, IReadAllOptions } from '@shared/crud';
import messagesModel, { MessagesSchema } from './messages.model';
import { PrimaryKey } from '@lib/mongoose';

export class MessagesService extends CrudService<MessagesSchema> {
    constructor() {
        super(
            new Repo(messagesModel),
            {
                create: {
                    result: (document) => document
                }
            }
        );
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
