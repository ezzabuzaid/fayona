import { Entity, Field, BaseModel } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.CONVERSATIONS)
export class ConversationSchema {
    @Field({
        required: true,
        ref: Constants.Schemas.USERS
    }) user1: Types.ObjectId;
    @Field({
        required: true,
        ref: Constants.Schemas.USERS
    }) user2: Types.ObjectId;
    @Field() folder?: string = null;
}
export default BaseModel(ConversationSchema);

/**
 * when a user search for another one a chat card will opened
 * and a request should be send to server asking for a conversation
 * if there's no conversation, then a one should be created only after the first message
 *
 * in the future, the conversation will be created after the user follows another
 */

// tslint:disable: max-line-length
/**
 * 1. list of conversation will be shown, conversation simply two or more participant talking to each other at the same time
 * 2. if the user opened a coneversation it will open a connection to socket
 * 3. when the user select participant from search a server request should be issue in order to get the old messages
 * if there was no message then a new conversation will be created only after the first message
 * 4.
 */
