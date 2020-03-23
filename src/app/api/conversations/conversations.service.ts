import { CrudService, Repo } from '@shared/crud';
import conversationsModel, { ConversationSchema } from './conversations.model';
import foldersService from '@api/uploads/folders.service';

export class ConversationsService extends CrudService<ConversationSchema> {
    constructor() {
        super((new Repo(conversationsModel)),
            {
                all: {
                    pre(documents) {
                        documents.populate('user1');
                        documents.populate('user2');
                    }
                },
                one: {
                    pre(query) {
                        query.populate('user1');
                        query.populate('user2');
                    }
                },
                create: {
                    async pre(conversation) {
                        const folder = await foldersService.create({
                            name: conversation.id,
                            user: conversation.user1 as any
                        });
                        conversation.folder = folder.data.id;
                    }
                }
            }
        );
    }

    getConversation(user1: string, user2: string) {
        return this.repo.fetchOne({})
            .or([
                {
                    user1,
                    user2
                },
                {
                    user2: user1,
                    user1: user2
                }
            ])
            .exec();
    }

}

export default new ConversationsService();
