import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.SESSIONS)
export class SessionSchema {
    @Field() public user_id: Types.ObjectId;
    @Field({ default: true }) public active: boolean;
    @Field() public device_uuid: string;
    // TODO: presist device info and user location
}

export const SessionModel = BaseModel<SessionSchema>(SessionSchema);
