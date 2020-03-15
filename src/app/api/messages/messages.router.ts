import { Router } from '@lib/methods';
import { CrudRouter, CrudService, Repo } from '@shared/crud';
import { Entity, BaseModel, Field } from '@lib/mongoose';

@Entity('Conversation')
export class ConversationSchema {
    @Field() public text: string;
}

const ConversationModel = BaseModel(ConversationSchema);

@Router('Conversation')
export class ConversationRouter extends CrudRouter<ConversationSchema> {
    constructor() {
        super(new CrudService(new Repo(ConversationModel)));
    }
}
