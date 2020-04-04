import { Entity, Field, BaseModel, PrimaryID } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.MESSAGES)
export class MessagesSchema {
    @Field({ lowercase: false }) text: string;
    @Field() user: PrimaryID;
    @Field({ required: true }) room: PrimaryID;
}
export default BaseModel(MessagesSchema);
