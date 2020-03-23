import { CrudService, Repo } from '@shared/crud';
import messagesModel, { MessagesSchema } from './messages.model';

export class MessagesService extends CrudService<MessagesSchema> {
    constructor() {
        super(new Repo(messagesModel));
    }
}

export default new MessagesService();
