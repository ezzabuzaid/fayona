import { Entity, Field, BaseModel, PrimaryKey } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.MESSAGES)
export class MessagesSchema {
    @Field({ lowercase: false }) text: string;
    @Field({ required: true }) user: PrimaryKey;
    @Field({ required: true }) room: PrimaryKey;
    @Field({ required: true }) order: number;
}
