import { Entity, Field, BaseModel, PrimaryKey } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.MESSAGES)
export class MessagesSchema {
    @Field({ lowercase: false }) text: string;
    @Field() user: PrimaryKey;
    @Field({ required: true }) room: PrimaryKey;
}
export default BaseModel(MessagesSchema);
