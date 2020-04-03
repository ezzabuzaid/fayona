import { Entity, Field, BaseModel } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.MESSAGES)
export class MessagesSchema {
    @Field({ lowercase: false }) text: string;
    @Field() user: Types.ObjectId;
    @Field({
        required: true
    }) conversation: Types.ObjectId;
}
export default BaseModel(MessagesSchema);
