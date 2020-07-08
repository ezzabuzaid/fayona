import { Constants } from '@core/helpers';
import { Entity, Field, PrimaryKey } from '@lib/mongoose';

@Entity(Constants.Schemas.MESSAGES)
export class MessagesSchema {
    @Field({ lowercase: false }) text: string;
    @Field({ required: true }) user: PrimaryKey;
    @Field({ required: true }) room: PrimaryKey;
    @Field({ required: true }) order: number;
}
