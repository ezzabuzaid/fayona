import { Entity, Field, BaseModel } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.Messages)
export class MessagesSchema {
    @Field() text: string;
    @Field() user: string;
    @Field({
        required: true
    }) conversation: Types.ObjectId;
}
export default BaseModel(MessagesSchema);
